import styled from '@lib/emotion'

interface PinButtonProps {
    open: boolean
}
export const PinButton = styled.svg<PinButtonProps>`
    min-width: 24px;
    margin: auto 8px;
    cursor: pointer;

    path {
        color: ${({theme, open}) => theme.colors._primary.fade(open ? 0 : 0.335).string()};
    }

    &:hover path {
        color: ${({theme}) => theme.colors._primary.fade(0.17).string()};
    }
`

interface DisplayProps {
    right: number
}
export const Display = styled.div<DisplayProps>`
    background: black;
    position: absolute;
    top: 40px;
    right: ${({right}) => right}px;
    width: 420px;
    overflow-y: auto;
    max-height: calc(100% - 40px);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 0 1px rgba(4,4,5,0.15), 0 8px 16px rgba(0,0,0,0.24);
    max-width: 100%;

    @media (max-width: 800px) {
        right: 0;
    }
`

export const Title = styled.div`
    background-color: ${({ theme }) => theme.colors._background.darken(0.41).string()};
    padding: 16px;
    font-family: var(--font-display);
    font-weight: 600;
    box-shadow: 0 1px 0 rgba(4,4,5,0.2), 0 1.5px 0 rgba(6,6,7,0.05), 0 2px 0 rgba(4,4,5,0.05);
`

export const List = styled.div`
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors._background.darken(0.15).string()};
    padding: 8px;
`

export const Pin = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    margin-bottom: 6px;
    border: 1px solid ${({ theme }) => theme.colors._background.darken(0.41).string()};
    border-radius: 4px;

    .group {
        padding: 12px 16px;
    }

    .message div {
        height: auto;
    }
`

export const NoPins = styled.div`
    margin: 8px 0 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
        margin-top: 20px;
        text-align: center;
    }
`
