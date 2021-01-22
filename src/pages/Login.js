import React, { useContext, useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks'

export default function Login(props) {
    const [errors, setErrors] = useState({})
    const context = useContext(AuthContext);

    const { onChange, onSubmit, values} = useForm(loginUserCallback, {
        
        email: '',
        username: '',
    
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData }}) {
            context.login(userData);
            props.history.push('/')
        },
        onError(err) {
            setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser();
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1 className="text-center">Login</h1>
                <Form.Input
                    type='text'
                    label="Username: "
                    placeholder="Ex. CoolGuy100"
                    name="username"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    type="password"
                    label="Password: "
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
mutation login(
    $username: String!
    $password: String!
) {
    login(
        username: $username
        password: $password
    ){
        id email username createdAt token
    }
}
`
