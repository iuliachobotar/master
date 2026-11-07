import { Datagrid, List, TextField, ReferenceField, NumberField, SelectField } from "react-admin";

export const ChallengeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="question"/>
                <SelectField
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
                />
                <ReferenceField source="lessonsId" reference="lessons"/>
                <NumberField source="order"/>
            </Datagrid>
        </List>
    );
};