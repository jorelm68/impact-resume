export default {
    absolute: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },

    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    reset: {
        margin: '0px',
        padding: '0px',
        border: 'none',
        outline: 'none',
        background: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
        textDecoration: 'none',
    },

    colors: {
        black: '#000000',
        white: '#FFFFFF',
        offWhite: 'rgba(255, 255, 255, 0.9)',
        shadow: 'rgba(0, 0, 0, 0.3)',
        blue: '#007BFF',
        hoverBlue: '#0056b3',
    }
}