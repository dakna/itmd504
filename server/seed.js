import { Guid } from 'js-guid';

const seedOneId = Guid.newGuid().toString();
const seedTwoId = Guid.newGuid().toString();
const seedThreeId = Guid.newGuid().toString();
const seedFourId = Guid.newGuid().toString();

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
        motivation: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        resumeUrl: 'http://www.example.com/',
        score: 4,
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
        motivation: 'Second Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        resumeUrl: 'http://www.example.com/',
        score: 2
      },
      SEED3: {
        id: seedThreeId,
        collegeId: '1465',
        partitionKey: 'EAST',
        firstName: 'William',
        lastName: 'Jones',
        address: {
            state: 'MI',
            city: 'Lansing',            
        },  
        motivation: 'Third Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        resumeUrl: 'http://www.example.com/',
        score: 3
      },
      SEED4: {
        id: seedFourId,
        collegeId: '1318',
        partitionKey: 'EAST',
        firstName: 'Thomas',
        lastName: 'Cooper',
        address: {
            state: 'IL',
            city: 'Chicago',            
        },  
        motivation: 'Fourth Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        resumeUrl: 'http://www.example.com/',
        score: 5
      }             
}; 
