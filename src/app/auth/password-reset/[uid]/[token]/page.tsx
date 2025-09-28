// ai-chat-next/src/app/auth/password-reset/[uid]/[token]/page.tsx
import ResetPasswordForm from "@features/users/ResetPasswordForm";

interface Props {
    params: {
      uid: string;
      token: string;
    };
}
export default function Page(props: Props) {
    const { uid, token } = props.params;
    return <ResetPasswordForm uid={uid} token={token} />;
  }