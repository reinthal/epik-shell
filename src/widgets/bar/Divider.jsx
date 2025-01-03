// export default () =>
//   new Widget.Box({
//     className: "divider",
//     vexpand: true,
//   });
export default function Divider({ ...props }) {
  return <box cssClasses={["divider"]} vexpand {...props} />;
}
