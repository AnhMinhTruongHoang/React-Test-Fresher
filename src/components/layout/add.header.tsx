import { useCurrentApp } from "@/context/app.context";

const AppHeader = () => {
  const { user } = useCurrentApp();
  return (
    <>
      <div>app header</div>
      <div>{JSON.stringify(user)}</div>
    </>
  );
};

export default AppHeader;
