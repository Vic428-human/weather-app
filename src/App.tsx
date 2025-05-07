import { Button } from "@/components/ui/button";
//也可以將BrowserRouter 換成 HashRouter 使用
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>Hello</Layout>
    </BrowserRouter>
  );
}

export default App;
