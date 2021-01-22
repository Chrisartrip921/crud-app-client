import React, {useContext} from 'react';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import {AuthContext} from '../context/auth'
import { Card, Grid, Icon, Label, Image, Button } from 'semantic-ui-react';
import LikeButton from '../components/LikeButton';

function SinglePost(props) {
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext)

    console.log(postId)
    const { data: {getPost}} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    let postMarkup;
    if(!getPost){
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.column width={2}>
                    <Image 
                     src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                     size="small"
                     float="right"
                    />
                    </Grid.column>
                    <Grid.column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}} />
                                <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')}>
                                    <Button basic color="orange">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="orange" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                            </Card.Content>
                        </Card>
                    </Grid.column>
                </Grid.Row>
            </Grid>
        )
    }
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId) {
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`
export default SinglePost;