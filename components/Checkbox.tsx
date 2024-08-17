import View from "./View";

export default function () {
    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1rem',
        }}>
            <input type="checkbox" />
        </View>
    )
}