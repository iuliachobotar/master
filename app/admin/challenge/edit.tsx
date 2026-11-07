import { SimpleForm, Edit, TextInput, required, ReferenceInput, NumberInput, SelectInput } from "react-admin";

export const ChallengeEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput 
                source="question" 
                validate={[required()]} 
                label="Question"/>
                <SelectInput
                    source="type"
                    choices={[
                        {
                            id: "SELECT",
                            name: "SELECT",
                        },
                        {
                            id: "ASSIST",
                            name: "ASSIST",
                        },
                        {
                            id: "TYPE",
                            name: "TYPE",
                        },
                        {
                            id: "FLIP",
                            name: "FLIP",
                        },
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
            
        </Edit>
    );
};