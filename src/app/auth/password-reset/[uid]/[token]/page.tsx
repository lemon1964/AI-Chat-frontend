// src/app/auth/password-reset/[uid]/[token]/page.tsx
import ResetPasswordForm from "@features/users/ResetPasswordForm";

type PageProps = {
  params: Promise<{
    uid: string;
    token: string;
  }>;
};

export default async function Page(props: PageProps) {
  const { uid, token } = await props.params;
  
  return <ResetPasswordForm uid={uid} token={token} />;
}
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default function Page(props: any) {
//   const { uid, token } = props.params;
//   return <ResetPasswordForm uid={uid} token={token} />;
// }

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