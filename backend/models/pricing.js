import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Pricing extends Model {}

Pricing.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Validity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recording: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sharedNotes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breakout: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screenshare: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sharedRoomAccess: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    multiuserwhiteboard: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storage:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    period:{
      type:DataTypes.STRING,
      allowNull:false
    },

    //--------------LMS-----------------------------------------

    freelms:{
      type:DataTypes.STRING,
      allowNull:false
    },
    courseManagement:{
      type:DataTypes.STRING,
      allowNull:false
    },
    efficientDigitalBookManagement:{
      type:DataTypes.STRING,
      allowNull:false
    },
    bulkEnrollment:{
      type:DataTypes.STRING,
      allowNull:false
    },
    communicationTools:{
      type:DataTypes.STRING,
      allowNull:false
    },
    studentManagement:{
      type:DataTypes.STRING,
      allowNull:false
    },
    reportsAndAnalytics:{
      type:DataTypes.STRING,
      allowNull:false
    },
    customizationAndPersonalization:{
      type:DataTypes.STRING,
      allowNull:false
    },
    assessmentAndGrading:{
      type:DataTypes.STRING,
      allowNull:false
    }, 
    
    // -------AI--------

     multipleChoiceQuestions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rubricGenerator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentWorkFeedback: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    professionalEmailCommunication: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    depthOfKnowledgeQuizGenerator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    careerOrCollegeCounselor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideaGenerator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    learnCoding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    syllabus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assessmentOutline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonPlan5Es: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    claimEvidenceReasoning: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    debate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mockInterview: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectBasedLearning: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamBasedActivity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    battleshipStyle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fillInTheBlankQuestions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scenarioBasedQuestions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trueFalseQuestions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timelyRelevantActionableFeedback: {
      type: DataTypes.STRING,
      allowNull: false,
    },


  },
  {
    sequelize,
    modelName: "pricing",
    timestamps: true,
  }
);

export default Pricing;
