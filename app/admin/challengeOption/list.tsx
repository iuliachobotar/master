import {
    Datagrid,
    List,
    TextField,
    ReferenceField,
    NumberField,
    BooleanField,
    ReferenceInput,
    SelectInput,
} from "react-admin";

const filters = [
    <ReferenceInput key="courseId" source="courseId" reference="courses" alwaysOn perPage={1000}>
        <SelectInput optionText="title" label="Course" />
    </ReferenceInput>,
    <ReferenceInput key="challengeId" source="challengeId" reference="challenges" alwaysOn perPage={1000}>
        <SelectInput optionText="question" label="Challenge" />
    </ReferenceInput>,
];

export const ChallengeOptionList = () => {
    return (
        <List filters={filters} sort={{ field: "id", order: "ASC" }}>
            <Datagrid rowClick="edit">
                <NumberField source="id"/>
                <TextField source="text"/>
                <TextField source="translation"/>
                <BooleanField source="correct"/>
                <ReferenceField source="challengeId" reference="challenges"/>
                <TextField source="imageSrc"/>
                <TextField source="audioSrc"/>
            </Datagrid>
        </List>
    );
};