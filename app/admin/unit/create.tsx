import { SimpleForm, Create, TextInput, required, ReferenceInput, NumberInput } from "react-admin";
import { CreateToolbar } from "@/app/admin/createToolbar";

export const UnitCreate = () => {
    return (
        <Create>
            <SimpleForm toolbar={<CreateToolbar keep={["courseId"]} />}>
                <TextInput
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <TextInput
                    source="description"
                    validate={[required()]}
                    label="Description"
                />
                <ReferenceInput
                    source="courseId"
                    reference="courses"
                />
                <NumberInput
                    source="order"
                    validate={[required()]}
                    label="Order"
                />
            </SimpleForm>
        </Create>
    );
};