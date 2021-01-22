import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

export default function Register(props) {
    const [errors, setErrors] = useState({})
    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });

    }

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, result) {
            console.log(result)
            props.history.push('/')
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors)
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    const onSubmit = (event) => {
        event.preventDefault();
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1 className="text-center">Register</h1>
                <Form.Input
                    type="text"
                    label="Email:"
                    placeholder="Example@example.com"
                    name="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />
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
                <Form.Input
                    type="password"
                    label="Confirm Password: "
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
mutation register(
    $email: String!
    $username: String!
    $password: String!
    $confirmPassword: String!
) {
    register(
        registerInput: {
            email: $email
            username: $username
            password: $password
            confirmPassword: $confirmPassword
        }
    ){
        id email username createdAt token
    }
}
`
