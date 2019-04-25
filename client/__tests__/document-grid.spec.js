import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { prettyPrintFileSize, aggregateFileSizes } from '~/utils';
import { DocumentGrid } from '~/components/stateless/document-grid';

describe('<DocumentGrid />', () => {
  const data = {
    files: [
      { name: 'passport-2019-04-11', sizeInBytes: 583543, id: 'oaesutsoateuhsaotuh' },
      { name: 'iaoeuaoesu', sizeInBytes: '421123', id: 'uuehisaoetdisddqjmkzmoatsuh' },
      { name: 'a test', sizeInBytes: '0.0', id: 'sidjkoscudoesacqaoeqjkacusoemu' },
      { name: 'a test 2', sizeInBytes: 'a', id: 'asoehuccplylcrpgrchsbthhsh' },
    ]
  };

  describe('the files property', () => {
    it(`when passed an array of files, displays the total amount of files, the total size, and the files themselves`, () => {
      const { files } = data;
      const totalFilesSize = prettyPrintFileSize('kb', aggregateFileSizes(files));
      const el = render(<DocumentGrid files={files} />);
      expect(el.find('.document-tile').length).toEqual(files.length);
      expect(el.find('.document-grid-info__total-files').text()).toEqual(`${files.length} documents`);
      expect(el.find('.document-grid-info__total-files-size').text()).toEqual(`Total size: ${totalFilesSize}`);
    });
    it('when passed anything but a non-empty empty, displays nothing', () => {
      let el;
      el = mount(<DocumentGrid />);
      expect(el.find('.document-tile').length).toEqual(0);
      el = mount(<DocumentGrid files={[]} />);
      expect(el.find('.document-tile').length).toEqual(0);
      el = mount(<DocumentGrid files={true} />);
      expect(el.find('.document-tile').length).toEqual(0);
      el = mount(<DocumentGrid files={null} />);
      expect(el.find('.document-tile').length).toEqual(0);
      el = mount(<DocumentGrid files={undefined} />);
      expect(el.find('.document-tile').length).toEqual(0);
      el = mount(<DocumentGrid files="a" />);
      expect(el.find('.document-tile').length).toEqual(0);
      el = mount(<DocumentGrid files={1} />);
      expect(el.find('.document-tile').length).toEqual(0);
    });
  });

  describe('the isLoading property', () => {
    it('hides the loading indicator when missing or false', () => {
      let el;
      el = mount(<DocumentGrid isLoading={false} />);
      expect(el.find('.document-grid__loading-indicator').length).toEqual(0);
      el = mount(<DocumentGrid />);
      expect(el.find('.document-grid__loading-indicator').length).toEqual(0);
    });
    it('shows a loading indicator when true', () => {
      const el = mount(<DocumentGrid isLoading={true} />);
      expect(el.find('.document-grid__loading-indicator').length).toEqual(1);
    });
  });
});
