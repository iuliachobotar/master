import {
    SimpleForm,
    Create,
    TextInput,
    required,
    ReferenceInput,
    BooleanInput,
    SelectInput,
} from "react-admin";

export const ChallengeOptionCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput
                    source="text"
                    validate={[required()]}
                    label="Text"
                    helperText="Для FLIP — слово іноземною мовою (лицьова сторона картки)."
                />

                <BooleanInput
                    source="correct"
                    label="Correct option"
                    helperText="SELECT/ASSIST: правильна відповідь. TYPE: увімкнено — це треба набрати, вимкнено — показати як уже написане. FLIP: можна лишити увімкненим."
                />

                <ReferenceInput
                    source="challengeId"
                    reference="challenges"
                >
                    <SelectInput
                        optionText="question"
                        validate={[required()]}
                        label="Challenge"
                    />
                </ReferenceInput>

                <TextInput
                    source="translation"
                    label="Translation (для FLIP)"
                    helperText="Український переклад на звороті фліп-картки. Для інших типів лишити порожнім."
                />

                <TextInput
                    source="imageSrc"
                    label="Image URL"
                />

                <TextInput
                    source="audioSrc"
                    label="Audio URL"
                />
            </SimpleForm>
        </Create>
    );
};