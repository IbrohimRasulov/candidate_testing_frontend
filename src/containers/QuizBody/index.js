import React from 'react';
import { connect } from 'react-redux';
import { updateReviewList, updateUserAnswers } from '../../redux/ActionCreators';

import QABody from '../../components/QABody';

const quizBodyStyle = {
	width: '100%',
	height: '100%',
	padding: '2em 1em 2em 1em',
	flex: 'display',
	flexDirection: 'column',
	paddingLeft: '20%',
	paddingRight: '20%',
}

class QuizBody extends React.Component {
	constructor() {
		super();
		this.state = {
			questionBody: {
				number: undefined,
				question: '',
				answers: {},
				correct: [],
				next: '',
				prev: ''
			},
		}
		this.udpateQuestionBodyFromProps = this.udpateQuestionBodyFromProps.bind(this);
	}

	componentDidMount() {
		const { question } = this.props;

		this.udpateQuestionBodyFromProps(question)
	}

	componentDidUpdate(prevProps, prevState) {
		const { question } = this.props;

		if (prevProps.question !== this.props.question) {
			this.udpateQuestionBodyFromProps(question)
		}
	}

	// morph question data to match QABody question body
	udpateQuestionBodyFromProps(question) {
		if (question !== undefined) {
			const { results } = question;
			const questionData = results[0]

			var newQuestionBody = {}
			var newAnswers = {}
			var newCorrectList = []
			let key = ''

			// fill newAnswers and newCorrectList from newly recieved question.results.answers
			questionData.answers.forEach((item, id) => {
				key = String.fromCharCode(id + 65) // map id number to alphabet (e.g. 0 -> A)
				newAnswers[key] = item.text
				if (item.correct === true)
					newCorrectList.push(key)
			})

			newQuestionBody = {
				number: question.page_number,
				question: questionData.prompt,
				answers: newAnswers,
				correct: newCorrectList,
				next: question.links.next,
				prev: question.links.prev
			}

			this.setState({
				...this.state,
				questionBody: newQuestionBody
			})
		}
	}

	render() {
		const {
			chosenQuizId,
			totalQuestions,
			userAnswers,
			updateUserAnswers,
			reviewList,
			updateReviewList,
			fetchPaginatedQuestion,
			setIsFetchingAllQuestions,
			fetchAllQuestionsUnderQuiz,
		} = this.props;
		const {
			questionBody
		} = this.state;

		return (
			<div style={quizBodyStyle}>
				<QABody
					chosenQuizId={chosenQuizId}
					totalQuestions={totalQuestions}
					questionBody={questionBody}
					userAnswers={userAnswers}
					updateUserAnswers={updateUserAnswers}
					reviewList={reviewList}
					updateReviewList={updateReviewList}
					fetchPaginatedQuestion={fetchPaginatedQuestion}
					setIsFetchingAllQuestions={setIsFetchingAllQuestions}
					fetchAllQuestionsUnderQuiz={fetchAllQuestionsUnderQuiz}
				/>
			</div>
		)
	};
}

const mapStateToProps = (state) => {
	return {
		reviewList: state.reviewList,
		userAnswers: state.userAnswers,
		chosenQuizId: state.chosenQuizId
	};
}

const mapDispatchToProps = (dispatch) => ({
	updateReviewList: (newReviewList) => dispatch(updateReviewList(newReviewList)),
	updateUserAnswers: (newUserAnswers) => dispatch(updateUserAnswers(newUserAnswers))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuizBody);
