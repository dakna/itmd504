import { Guid } from 'js-guid';

const seedOneId = Guid.newGuid().toString();
const seedTwoId = Guid.newGuid().toString();

export const seedApplications = {
    SEED1: {
        id: seedOneId,
        collegeId: '3434',
        partitionKey: 'EAST',
        firstName: 'John',
        lastName: 'Smith',
        address: {
            state: 'WA',
            city: 'Seattle',            
        },  
        references: [
          {
            url: 'http://www.example.com/'
          }
        ],
        motivation: 'Lorem Ipsum',
        resumeUrl: 'http://www.example.com/',
      },
      SEED2: {
        id: seedTwoId,
        collegeId: '4833',
        partitionKey: 'EAST',
        firstName: 'Michael',
        lastName: 'Turner',
        address: {
            state: 'CA',
            city: 'San Diego',            
        },  
        references: [
          {
            url: 'http://www.example.com/'
          }
        ],
        motivation: 'Lorem Ipsum 2',
        resumeUrl: 'http://www.example.com/',
      }
}; 
