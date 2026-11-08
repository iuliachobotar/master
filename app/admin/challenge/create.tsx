import { SimpleForm, Create, TextInput, required, ReferenceInput, NumberInput, SelectInput } from "react-admin";
import { CreateToolbar } from "@/app/admin/createToolbar";

export const ChallengeCreate = () => {
    return (
        <Create>
            <SimpleForm toolbar={<CreateToolbar keep={["lessonsId"]} />}>
                <TextInput
                    source="question"
                    validate={[required()]}
                    label="Question"
                />
                <SelectInput
                    source="type"
                    choices={[
                        { id: "SELECT", name: "SELECT" },
                        { id: "ASSIST", name: "ASSIST" },
                        { id: "TYPE", name: "TYPE" },
                        { id: "FLIP", name: "FLIP" },
                    ]}
                    validate={[required()]}
                />
                <ReferenceInput
                    source="lessonsId"
                    reference="lessons"
                >
                    <SelectInput
                        optionText="title"
                        validate={[required()]}
                        label="Lesson"
                    />
                </ReferenceInput>
                <NumberInput
                    source="order"
                    validate={[required()]}
                    label="Order"
                />
            </SimpleForm>
        </Create>
    );
};