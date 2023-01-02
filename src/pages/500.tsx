import { Button, Result } from "antd";
import { useRouter } from "next/router";

export default function ServerErrorPage() {
  const router = useRouter();

  return <Result status="500" title="500"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary" onClick={() => router.back()}>Back</Button>} />
}
