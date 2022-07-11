import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  div {
    flex: 1;
    display: flex;
    flex-direction: row;

    input {
      flex: 1;
      border: ${props =>
        props.error ? '3px solid #e65100' : '1px solid #eee'};
      padding: 10px 15px;
      border-radius: 4px;
      font-size: 16px;
    }
  }

  span {
    padding: 10px 0px;
    color: #e65100;
    display: ${props => (props.error ? 'block' : 'none')};
  }
`;

const rotate = keyframes`
  to {
    transform: rotate(0deg);
  }

  from {
    transform: rotate(360deg);
  }
`;

export const SubmitForm = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.load,
}))`
  background: #e65100;
  border: 0;
  padding: 0px 15px;
  margin-left: 15px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.load &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #e65100;
      text-decoration: none;
    }
  }
`;
