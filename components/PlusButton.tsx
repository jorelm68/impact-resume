import constants from "@/lib/constants";

export default function PlusButton({ onClick }: { onClick?: () => void }) {
    return (
        <button style={{
            width: '24px',
            height: '24px',
            backgroundColor: constants.colors.lightBlue,
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
        }} onClick={onClick}>
            <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
            }}>+</span>
        </button>
    )
}