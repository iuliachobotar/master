import { SimpleForm, Create, TextInput, required, ReferenceInput, NumberInput } from "react-admin";
import { CreateToolbar } from "@/app/admin/createToolbar";

export const LessonCreate = () => {
    return (
        <Create>
            <SimpleForm toolbar={<CreateToolbar keep={["unitId"]} />}>
                <TextInput
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <ReferenceInput
                    source="unitId"
                    reference="units"
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