import { signupTemplate } from "@/emails/signupTemplate";

export default function EmailPreview() {
    const previewHTML = signupTemplate("John Doe"); // Example name

    return (
        <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
    );
}
