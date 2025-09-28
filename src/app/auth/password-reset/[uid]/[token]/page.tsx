// ai-chat-next/src/app/auth/password-reset/[uid]/[token]/page.tsx
import ResetPasswordForm from "@features/users/ResetPasswordForm";

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const { uid, token } = params;
  return <ResetPasswordForm uid={uid} token={token} />;
}

// interface Props {
//     params: {
//       uid: string;
//       token: string;
//     };
// }
// export default function Page(props: Props) {
//     const { uid, token } = props.params;
//     return <ResetPasswordForm uid={uid} token={token} />;
//   }