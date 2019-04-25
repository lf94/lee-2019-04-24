import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { DocumentTile } from '~/components/stateless/document-tile';

describe('<DocumentTile />', () => {
  const data = {
    title: 'Passport'
  }

  describe('the title property', () => {
    it(`when passed "${data.title}", displays it as the title `, () => {
      const el = shallow(<DocumentTile title={data.title} sizeInBytes="1" onDelete={() => {}}/>);
      expect(el.find('.document-tile__title').text()).toEqual(data.title);
    });
    it('displays "Untitled" when it is missing', () => {
      const el = shallow(<DocumentTile sizeInBytes="1" onDelete={() => {}}/>);
      expect(el.find('.document-tile__title').text()).toEqual('Untitled');
    });
  });

  describe('the sizeInBytes property', () => {
    it('display size in kilobytes, not kibibytes', () => {
      const el = shallow(<DocumentTile title="Passport" sizeInBytes="1024" onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('1.02 kb');
    });
    it('displays 0 kb when anything other than a number is passed to it', () => {
      let el;
      el = shallow(<DocumentTile title="Passport" sizeInBytes="a" onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('0 kb');
      el = shallow(<DocumentTile title="Passport" onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('0 kb');
      el = shallow(<DocumentTile title="Passport" sizeInBytes={true} onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('0 kb');
      el = shallow(<DocumentTile title="Passport" sizeInBytes={null} onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('0 kb');
      el = shallow(<DocumentTile title="Passport" sizeInBytes={undefined} onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('0 kb');
      el = shallow(<DocumentTile title="Passport" sizeInBytes={() => {}} onDelete={() => {}}/>);
      expect(el.find('.document-tile__size').text()).toEqual('0 kb');
    });
  });

  describe('the beingProcess property', () => {
    it('displays an overlay when true', () => {
      const el = shallow(<DocumentTile beingProcessed={true} title="Passport" sizeInBytes="a" onDelete={() => {}}/>);
      expect(el.find('.document-tile__processing-overlay').length).toEqual(1);
    });
    it('hides the overlay when false', () => {
      const el = shallow(<DocumentTile beingProcessed={false} title="Passport" sizeInBytes="a" onDelete={() => {}}/>);
      expect(el.find('.document-tile__processing-overlay').length).toEqual(0);
    });
  });

  describe('the onDelete property', () => {
    it('shows a button when there is a callback passed', () => {
      const el = mount(<DocumentTile title="Passport" sizeInBytes="1" onDelete={() => {}}/>);
      expect(el.find('.document-tile__delete').length).toEqual(1);
    });
    it('hides the button if anything other than a function is passed', () => {
      let el;
      el = shallow(<DocumentTile title="Passport" sizeInBytes="1" />);
      expect(el.find('.document-tile__delete').length).toEqual(0);
      el = shallow(<DocumentTile title="Passport" sizeInBytes="1" onDelete="a" />);
      expect(el.find('.document-tile__delete').length).toEqual(0);
      el = shallow(<DocumentTile title="Passport" sizeInBytes="1" onDelete={null}/>);
      expect(el.find('.document-tile__delete').length).toEqual(0);
      el = shallow(<DocumentTile title="Passport" sizeInBytes="1" onDelete={0.0}/>);
      expect(el.find('.document-tile__delete').length).toEqual(0);
      el = shallow(<DocumentTile title="Passport" sizeInBytes="1" onDelete={true}/>);
      expect(el.find('.document-tile__delete').length).toEqual(0);
    });
  });
});
