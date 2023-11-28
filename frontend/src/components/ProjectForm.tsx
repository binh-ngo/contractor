import React, { useState, ChangeEvent, FormEvent } from 'react';
import './components.css';
import { ddbCreateProject } from '../graphql/projects';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';

const ProjectForm = () => {
    const questions: string[] = [
        'What type of decking or patio project is this?',
        'Please provide a detailed description of what you want us to do.',
        'What material do you want to build the deck with?',
        'What is the approximate size of this project in square footage?',
        'What is your timeframe?',
        'What type of property is it?',
        'Please provide your contact information and we will reach out to you shortly.',
    ];

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [slideRight, setSlideRight] = useState(false);
    const [slideLeft, setSlideLeft] = useState(false);

    const contactInfo = {
        name,
        address,
        city,
        phone,
        email
    }

    const [answers, setAnswers] = useState<string[]>(Array(Math.max(0, questions.length - 1)).fill(''));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    let navigate = useNavigate();

    const handleAnswerChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        let updatedAnswers = [...answers]; // Declare the variable outside the switch
        switch (event.target.name) {
            case 'Name':
                setName(event.target.value);
                break;
            case 'Address':
                setAddress(event.target.value);
                break;
            case 'City':
                setCity(event.target.value);
                break;
            case 'Phone':
                setPhone(event.target.value);
                break;
            case 'Email':
                setEmail(event.target.value);
                break;
            case 'startDate':
                setStartDate(event.target.value);
                break;
            case 'endDate':
                setEndDate(event.target.value);
                const timeFrameAnswer = getTimePassed(startDate, event.target.value);
                updatedAnswers[currentQuestionIndex] = timeFrameAnswer;
                break;
            default:
                updatedAnswers[currentQuestionIndex] = event.target.value;
                break;
        }
        setAnswers(updatedAnswers); // Update the state outside the switch

    };

    const getTimePassed = (startDate: string, endDate: string): string => {
        const start = moment(startDate);
        const end = moment(endDate);
        const duration = moment.duration(end.diff(start));
        return duration.humanize();
    };

    const handleNextQuestion = () => {
        setSlideLeft(true);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        setTimeout(() => {
            setSlideLeft(false);
        }, 0);
        console.log(answers);
        console.log(`START DATE ----${startDate}`)
        console.log(`END DATE ----${endDate}`)
    };

    const handlePreviousQuestion = () => {
        setSlideRight(true);
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
        setTimeout(() => {
            setSlideRight(false);
        }, 0);
        console.log(answers)
        console.log(`START DATE ----${startDate}`)
        console.log(`END DATE ----${endDate}`)
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (name && address && city && phone && email !== '' && answers !== null)
            console.log('Form data submitted:', answers);
        console.log('With this contact information:', contactInfo);

        const project = {
            projectType: answers[0],
            description: answers[1],
            material: answers[2],
            projectSize: answers[3],
            desiredCompletionTime: answers[4],
            propertyType: answers[5],
            clientName: contactInfo.name,
            address: contactInfo.address,
            city: contactInfo.city,
            clientPhone: contactInfo.phone,
            email: contactInfo.email,
            startDate,
            endDate
        }

        let createdProject = null;
        const response = await ddbCreateProject(project)
        if ('data' in response) {
            createdProject = response.data.createProject;
            console.log(`Response from DynamoDB: ${JSON.stringify(createdProject)}`);
        } else {
            console.error('Response is not a GraphQL result:', response);
        } if (createdProject) {
            console.log("Project successfully created")
            navigate(`/${createdProject.projectId}`);
        } else {
            console.log("onSave called but title or children are empty");
        }
    }

    const calculateProgress = () => {
        return ((currentQuestionIndex + 1) / questions.length) * 100 + '%';
    };

    const isFormValid = () => {
        const isTextInputsValid =
            name !== '' && address !== '' && city !== '' && phone !== '' && email !== '';

        const isQuestionsValid = answers.every(answer => answer !== '');

        const isNumber = !isNaN(Number(answers[3]));
        return isTextInputsValid && isQuestionsValid && isNumber;
    };

    const projectTypes = ['Build or Replace Deck', 'Repair Deck', 'Clean and Seal Deck', 'Patio', 'Paint a Deck'];
    const woodTypes = ['Cedar', 'Redwood', 'Ipewood', 'Tigerwood', 'Mahogany', 'Bamboo', 'Pressure-treated Wood', 'Trex (recycled composite)', 'Aluminum', 'Cement', 'Composite (Fiberglass, Vinyl, PVC)'];
    const propertyTypes = ['Residential', 'Business'];

    const renderInput = (question: string, answer: string, index: number) => {
        if (index === 0) {
            return (
                <div>
                    <h3 className='question-header'>{question}</h3>
                    <div className="radio-buttons">
                        {projectTypes.map((type: string) => (
                            <div className='radio-button-container'>
                                <input
                                    className='radio-button'
                                    key={type}
                                    type="radio"
                                    id={type}
                                    name="projectType"
                                    value={type}
                                    checked={answer === type}
                                    onChange={handleAnswerChange}
                                />
                                <label htmlFor={type} className='custom-radio-button-label'>
                                    <div
                                        className={`custom-radio-button ${answer === type ? 'checked' : ''}`}
                                        onClick={() => handleAnswerChange}
                                    ></div>
                                    {type}
                                </label>                                 </div>
                        ))}
                    </div>
                </div>
            );
        } else if (index === 2) {
            return (
                <div>
                    <h3 className='question-header'>{question}</h3>
                    <div className='radio-buttons'>
                        {woodTypes.map((type: string) => (
                            <div key={type} className='radio-button-container'>
                                <input
                                    key={type}
                                    className='radio-button'
                                    type="radio"
                                    id={type}
                                    name="material"
                                    value={type}
                                    checked={answer === type}
                                    onChange={handleAnswerChange}
                                />
                                <label htmlFor={type} className='custom-radio-button-label'>
                                    <div
                                        className={`custom-radio-button ${answer === type ? 'checked' : ''}`}
                                        onClick={() => handleAnswerChange}
                                    ></div>
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (index === 3) {
            const isNumber = !isNaN(Number(answer));
            return (
                <div>
                    <h3 className='question-header'>{question}</h3>
                    <input className={`text-input ${!isNumber ? 'error' : ''}`}
                        placeholder="Example: 150" type="text"
                        value={answer}
                        onChange={handleAnswerChange}
                    />
                    {!isNumber && <p className="error-message">Please enter a valid number.</p>}
                </div>
            );
        } else if (index === 4) {
            answer = getTimePassed(startDate, endDate);
            return (
                <>
                    <Row>
                        <Col className='mx-2'>
                            <h3>Start Date</h3>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={startDate}
                                onChange={handleAnswerChange}
                            />
                        </Col>

                        <Col className='mx-2'>
                            <h3>End Date</h3>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={endDate}
                                onChange={handleAnswerChange}
                            />
                        </Col>
                    </Row>
                </>
            );
        } else if (index === 5) {
            return (
                <div>
                    <h3 className='question-header'>{question}</h3>
                    <div className='radio-buttons'>
                        {propertyTypes.map((type: string) => (
                            <div key={type} className='radio-button-container'>
                                <input
                                    key={type}
                                    type="radio"
                                    className='radio-button'
                                    id={type}
                                    name="propertyType"
                                    value={type}
                                    checked={answer === type}
                                    onChange={handleAnswerChange}
                                />
                                <label htmlFor={type} className='custom-radio-button-label'>
                                    <div
                                        className={`custom-radio-button ${answer === type ? 'checked' : ''}`}
                                        onClick={() => handleAnswerChange}
                                    ></div>
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        else if (index === 6) {
            return (
                <div>
                    <h3 className='question-header'>{question}</h3>
                    <div className="user-details-form">
                        <Form>
                            <Form.Group className="mts-5" controlId="name">
                                <Form.Control type="text" placeholder="Name" name="Name" value={name} required onChange={(e: any) => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="address">
                                <Form.Control type="text" placeholder="Address" name="Address" value={address} required onChange={(e: any) => setAddress(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="city">
                                <Form.Control type="text" placeholder="City" name="City" value={city} required onChange={(e: any) => setCity(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="phone">
                                <Form.Control type="tel" placeholder="Phone" name="Phone" value={phone} required onChange={(e: any) => setPhone(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="email">
                                <Form.Control type="email" placeholder="Email" name="Email" value={email} required onChange={(e: any) => setEmail(e.target.value)} />
                            </Form.Group>
                        </Form>

                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h3 className='question-header'>{question}</h3>
                    <input className='text-input' type="text" value={answer} onChange={handleAnswerChange} />
                </div>
            );
        }
    };

    return (
        <div className={`question-form-container ${slideRight ? 'slideRight' : ''} ${slideLeft ? 'slideLeft' : ''}`}>
            <div className={`question-form ${slideRight ? 'slideRight' : ''} ${slideLeft ? 'slideLeft' : ''}`}>
                <div className={`progress-bar ${currentQuestionIndex === questions.length ? 'full-width' : ''}`} style={{ width: calculateProgress() }}></div>
                {currentQuestionIndex !== questions.length && (
                    <div className="question-answer">
                        {renderInput(questions[currentQuestionIndex], answers[currentQuestionIndex], currentQuestionIndex)}
                    </div>
                )}
                <div className="button-container">
                    <button
                        className="prev-button"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button className="next-button" onClick={handleNextQuestion}>
                            Next
                        </button>
                    ) : (
                        <button className={`submit-button ${!isFormValid() ? 'btn btn-secondary' : ''}`} disabled={!isFormValid()} onClick={handleSubmit}>
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
