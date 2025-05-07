import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      {/* variant 來自於 buttonVariants 的配置，這是shadcn/ui的用法 */}
      <Button variant={"destructive"}>Click me</Button>
    </div>
  );
}

export default App;
