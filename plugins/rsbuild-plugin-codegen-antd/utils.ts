import fs from "fs";
import satisfies from "semver/functions/satisfies";
import intersects from "semver/ranges/intersects";
import mustache from "mustache";
import path from "path";
import validatePkgName from "validate-npm-package-name";
import { execSync } from "child_process";

export const scan = (
  filepath: string,
  only?: MatchRule,
  scans: string[] = [],
) => {
  if (!fs.existsSync(filepath)) {
    console.warn(`${filepath} no exists, skip scan.`);
    return scans;
  } else if (fs.statSync(filepath).isDirectory()) {
    fs.readdirSync(filepath).forEach((sub) => {
      scan(path.join(filepath, sub), only, scans);
    });
  } else {
    const catchYou = only ? match(filepath, only) : true;
    if (catchYou) {
      scans.push(filepath);
    }
  }
  return scans;
};

export type GenOptions = {
  tplRoot: string;
  fragmentRoot?: string;
  outRoot: string;
  data: any;
  overwrite?: MatchRule;
};

export type MatchRule =
  | RegExp
  | RegExp[]
  | string
  | string[]
  | ((s: string) => boolean);

export const match = (s: string, rule?: MatchRule) => {
  if (typeof rule === "function") {
    return rule(s);
  } else if (Array.isArray(rule)) {
    return rule.find((r) => match(s, r));
  } else if (typeof rule === "string") {
    return s === rule;
  } else if (rule) {
    return rule?.test(s);
  } else {
    return false;
  }
};

export const gen = (options: GenOptions) => {
  const { tplRoot, fragmentRoot, outRoot, data } = options;
  const files = scan(tplRoot);
  const fragments = fragmentRoot
    ? scan(fragmentRoot, (x) => !/\.md$/.test(x))
    : [];

  const partials = fragments.reduce<Record<string, string>>((map, filepath) => {
    const key = filepath
      .replace(`${path.dirname(filepath)}/`, "")
      .replace(".mustache", "");
    map[key] = fs.readFileSync(filepath).toString();
    return map;
  }, {});

  files.forEach((filepath) => {
    const to = filepath.replace(tplRoot, outRoot).replace(/\.mustache$/, "");
    const canOverwrite = !fs.existsSync(to) || match(to, options.overwrite);
    if (!canOverwrite) return;
    const content = fs.readFileSync(filepath).toString();
    mustache.tags = ["[[", "]]"];
    try {
      const output = mustache.render(content, data, partials);
      const dir = path.dirname(to);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      console.log("🚀 ~ write to output:", to, output);
      fs.writeFileSync(to, output);
    } catch (error) {
      console.error(`Generator Files Error on ${to}, case by`, error);
      throw error;
    }
  });
};

const parseSpec = (x: string) => {
  const [nameOrEmpty, nameOrVersion, scopeVersion] = x.split("@");
  if (/^@/.test(x)) {
    return [`@${nameOrVersion}`, scopeVersion];
  } else {
    return [nameOrEmpty, nameOrVersion];
  }
};

export const checkDeps = (
  packageJson: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  },
  // @react@18.2, @ant-disign/icons@4.x, antd
  deps: string[],
  autoInstall: boolean,
) => {
  if (!deps || deps.length < 1) return true;

  let hasInvalidPkgName = false;
  const errors = deps.reduce<Record<string, string[]>>((map, spec) => {
    const [name] = parseSpec(spec);
    const maybe = validatePkgName(name).errors;
    if (maybe && maybe?.length > 0) {
      hasInvalidPkgName = true;
      map[name] = maybe;
    }
    return map;
  }, {});
  if (hasInvalidPkgName) {
    const format: string[] = [];
    format.push(
      `plugin-codegen-antd:check deps error: \n$${Object.entries(errors).map(
        ([pkgName, nameErrors]) => {
          return `${pkgName} : ${nameErrors.join("\n")}`;
        },
      )}`,
    );
    console.error(format.join("\n"));
    throw errors;
  }
  const pkgDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const pkgs = deps.reduce<string[]>((list, spec) => {
    const [name, version] = parseSpec(spec);

    if (pkgDeps[name]) {
      const ok = intersects(pkgDeps[name], version);

      if (!ok) {
        console.warn(`
dependencies check not intersects (by semver.intersects(v1, v2)), please fix by manual.
package.json -> ${name}: ${pkgDeps[name]}
config.deps -> ${name}: ${version}`);
      }
    } else if (autoInstall) {
      list.push(spec);
    }
    return list;
  }, []);

  if (autoInstall && pkgs.length > 0) {
    console.log(`🚀 ~ auto install deps ${pkgs.join(" ")}`);
    execSync(`npx ni ${pkgs.join(" ")}`, {
      stdio: "inherit",
    });
  }
};
