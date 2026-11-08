import {
    Datagrid,
    List,
    TextField,
    ReferenceField,
    NumberField,
    SelectField,
    ReferenceInput,
    SelectInput,
} from "react-admin";

const filters = [
    <ReferenceInput key="courseId" source="courseId" reference="courses" alwaysOn perPage={1000}>
        <SelectInput optionText="title" label="Course" />
    </ReferenceInput>,
    <ReferenceInput key="lessonsId" source="lessonsId" reference="lessons" alwaysOn perPage={1000}>
        <SelectInput optionText="title" label="Lesson" />
    </ReferenceInput>,
];

export const ChallengeList = () => {
    return (
        <List filters={filters} sort={{ field: "order", order: "ASC" }}>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="question"/>
                <SelectField
                    source="type"
                    choices={[
                        { id: "SELECT", name: "SELECT" },
                        { id: "ASSIST", name: "ASSIST" },
                        { id: "TYPE", name: "TYPE" },
                        { id: "FLIP", name: "FLIP" },
                    ]}
                />
                <ReferenceField source="lessonsId" reference="lessons"/>
                <NumberField source="order"/>
            </Datagrid>
        </List>
    );
};