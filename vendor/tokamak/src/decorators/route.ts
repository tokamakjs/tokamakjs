export function Route(args: any) {
  return (target: any) => {
    console.log(args, target);
  };
}
