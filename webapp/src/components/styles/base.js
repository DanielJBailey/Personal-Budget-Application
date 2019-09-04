import styled from '@emotion/styled'

export const Error = styled.div`
  background-color: ${props => props.theme.errorBackground};
  color: ${props => props.theme.errorText};
  width: 100%;
  text-align: center;
  padding: 16px;
  border-radius: 5px;
  margin-bottom: 16px;
  font-size: 14px;
`
