import styled from 'styled-components';

const Input = styled.input`
  border: 1px solid #fff;
  background: transparent;
  padding: 12px 20px;
  border-radius: 50px;
  width: 300px;
  box-sizing: border-box;
  color: #fff;
  font-size: 16px;
  margin-bottom: 10px;


  &::placeholder {
    color: #e9f6ffcd;
    font-size: 16px;
    text-align: center;
  }
`;

export default Input;