import styled from 'react-emotion'
import * as Modal from '@ui/Modal'
import Btn from '@ui/shared/button'
import { Spinner } from '@ui/Overlays/Loading/elements'

export const Root = styled(Modal.Content)`
  padding: 0;
  text-align: center;
  user-select: none;
  width: 500px;
  max-width: 95%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  overflow: visible;
`

export const Top = styled.div`
  padding: 10px 10px 10px 20px;
  display: flex;
`

export const Image = styled.img`
  max-height: 150px;
  max-width: 150px;
  margin-top: -50px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 40%);
`

export const Close = styled(Modal.Close)`
  position: relative;
  margin-left: auto;
`

export const Body = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 20px 20px;
  min-height: 300px;
  user-select: text;
  text-align: left;
  white-space: pre-wrap;
`

export const Title = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 10px 0;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  margin: 9px 0;

  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  user-select: none;

  span {
    margin-bottom: 6px;
  }
`

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  margin: 9px 0;
  font-size: 14px;
  cursor: pointer;

  input {
    appearance: none;
    position: absolute;
  }

  input:checked + .checkbox {
    border-color: ${({ theme }) => theme.colors._accent.lighten(.1).string()};

    svg {
      display: block;
    }
  }

  input:focus-visible + .checkbox {
    border-color: #00b0f4;
    transition: border-color .1s ease-in-out;
  }

  .checkbox {
    display: flex;
    height: 24px;
    width: 24px;
    border: 1px solid ${({ theme }) => theme.colors._primary.fade(0.7).string()};
    border-radius: 3px;
    margin-right: 10px;

    svg {
      display: none;
      margin: auto;
      pointer-events: none;

      path {
        color: ${({ theme }) => theme.colors.accent};
      }
    }
  }

  .checkbox-text {
    color: ${({ theme }) => theme.colors._primary.fade(0.173).string()};
    user-select: none;
  }
`

export const Button = styled(Btn)`
  margin-top: 10px;

  &::before {
    display: none;
  }
`

export const Loading = styled(Spinner)`
  position: absolute;
  left: 50%;
  top: 50%;
`
