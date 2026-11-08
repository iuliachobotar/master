import { Datagrid, List, TextField, ReferenceField, NumberField, ReferenceInput, SelectInput } from "react-admin";

const filters = [
    <ReferenceInput key="courseId" source="courseId" reference="courses" alwaysOn perPage={1000}>
        <SelectInput optionText="title" label="Course" />
    </ReferenceInput>,
    <ReferenceInput key="unitId" source="unitId" reference="units" alwaysOn perPage={1000}>
        <SelectInput optionText="title" label="Unit" />
    </ReferenceInput>,
];

export const LessonList = () => {
    return (
        <List filters={filters} sort={{ field: "order", order: "ASC" }}>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="title"/>
                <ReferenceField source="unitId" reference="units"/>
                <NumberField source="order"/>
            </Datagrid>
        </List>
    );
};