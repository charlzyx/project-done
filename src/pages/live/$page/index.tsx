import {} from "react";
import { useParams } from "react-router-dom";

const Page = () => {
  const params = useParams();
  return (
    <div>
      <div>HELLo</div>
      <pre>
        <code>{JSON.stringify(params, null, 2)}</code>
      </pre>
    </div>
  );
};

export default Page;
