/* global describe, it, before */

import chai from 'chai';
import {
  addEntity,
  addEntities,
  getEntities,
  updateEntity,
  deleteEntity,
  deleteEntities,
  addUnionId,
  addUnionIds,
  deleteUnionId
} from '../lib/library.js';

chai.expect();

const expect = chai.expect;

describe('Given an instance of my library', () => {
  // before(() => {
  //   const {  } = new Library();
  // });
  describe('addEntity', () => {
    it('should be a function', () => {
      expect(addEntity).to.be.a('function');
    });
  });

  describe('addEntities', () => {
    it('should be a function', () => {
      expect(addEntities).to.be.a('function');
    });
  });

  describe('getEntities', () => {
    it('should be a function', () => {
      expect(getEntities).to.be.a('function');
    });
  });

  describe('updateEntity', () => {
    it('should be a function', () => {
      expect(updateEntity).to.be.a('function');
    });
  });

  describe('deleteEntity', () => {
    it('should be a function', () => {
      expect(deleteEntity).to.be.a('function');
    });
  });

  describe('deleteEntities', () => {
    it('should be a function', () => {
      expect(deleteEntities).to.be.a('function');
    });
  });

  describe('addUnionId', () => {
    it('should be a function', () => {
      expect(addUnionId).to.be.a('function');
    });
  });

  describe('addUnionIds', () => {
    it('should be a function', () => {
      expect(addUnionIds).to.be.a('function');
    });
  });

  describe('deleteUnionId', () => {
    it('should be a function', () => {
      expect(deleteUnionId).to.be.a('function');
    });
  });
});
