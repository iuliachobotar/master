import { SimpleForm, Edit, TextInput, required } from "react-admin";
import { MediaInput } from "@/app/admin/mediaInput";

export const CourseEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput
                    source="id"
                    validate={[required()]}
                    label="id"
                />
                <TextInput
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <MediaInput source="imageSrc" label="Image" kind="image" />
            </SimpleForm>
        </Edit>
    );
};