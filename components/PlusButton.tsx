export default function PlusButton() {
    return (
        <button style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#ccc',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
        }}>
            <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
            }}>+</span>
        </button>
    )
}