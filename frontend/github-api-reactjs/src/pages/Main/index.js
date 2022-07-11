import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import Container from '../../components/Container';
import { Form, SubmitForm, List } from './styles';

import GitHubApi from '../../services/github-api';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: {
      status: false,
      message: '',
    },
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    try {
      const duplicateRepository = repositories.find(r => r.name === newRepo);

      if (duplicateRepository) {
        throw new Error('Repositório já foi adicionado.');
      }

      const response = await GitHubApi.get(`/repos/${newRepo}`);

      const repo = {
        name: response.data.full_name,
      };

      this.setState({
        newRepo: '',
        repositories: [...repositories, repo],
        loading: false,
        error: {
          status: false,
          message: '',
        },
      });
    } catch (err) {
      if (err.message.indexOf('404') > 0) {
        err.message = 'Repositório não encontrado';
      }
      this.setState({
        loading: false,
        error: { status: true, message: err.message },
      });
    }
  };

  render() {
    const { newRepo, loading, repositories, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositories
        </h1>

        <Form onSubmit={this.handleSubmit} error={error.status}>
          <div>
            <input
              type="text"
              placeholder="Add a repository"
              value={newRepo}
              onChange={this.handleInputChange}
            />
            <SubmitForm load={loading}>
              {loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaPlus color="#fff" size={14} />
              )}
            </SubmitForm>
          </div>

          <span>{error.message}</span>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
