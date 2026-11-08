import { Datagrid, List, TextField, ReferenceField, NumberField, ReferenceInput, SelectInput } from "react-admin";

const filters = [
    <ReferenceInput key="courseId" source="courseId" reference="courses" alwaysOn perPage={1000}>
        <SelectInput optionText="title" label="Course" />
    </ReferenceInput>,
];

export const UnitList = () => {
    return (
        <List filters={filters} sort={{ field: "order", order: "ASC" }}>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="title"/>
                <TextField source="description"/>
                <ReferenceField source="courseId" reference="courses"/>
                <NumberField source="order"/>
            </Datagrid>
        </List>
    );
};