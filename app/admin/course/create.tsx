import { SimpleForm, Create, TextInput, required } from "react-admin";
import { MediaInput } from "@/app/admin/mediaInput";
import { CreateToolbar } from "@/app/admin/createToolbar";

export const CourseCreate = () => {
    return (
        <Create>
            <SimpleForm toolbar={<CreateToolbar />}>
                <TextInput
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <MediaInput source="imageSrc" label="Image" kind="image" />
            </SimpleForm>
        </Create>
    );
};