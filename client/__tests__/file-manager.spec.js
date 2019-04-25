import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { FileManager } from '~/components/stateful/file-manager';

describe('<FileManager />', () => {
  describe('when mounted', () => {
    it('fetches all the documents with filesFetcher', () => {
      const noop = () => Promise.resolve({});
      const filesFetcher = jest.fn().mockReturnValue(Promise.resolve([]));
      const el = mount(<FileManager
        filesFetcher={ filesFetcher }
        onSearch={ noop }
        onUpload={ noop }
        onDelete={ noop }
      />);
      expect(filesFetcher).toHaveBeenCalledTimes(1);
      expect(filesFetcher).toHaveBeenCalledWith();
    });
  });

  describe('on search', () => {
    it('calls onSearch after 1 second of inputting a value', () => {
      const file = { name: 'Abcdefg', size: 12321, id: 'saoethus' };
      const files = [file];
      const noop = () => jest.fn().mockReturnValue(Promise.resolve());
      const onSearch = jest.fn().mockReturnValue(Promise.resolve(file));
      const filesFetcher = jest.fn().mockReturnValue(Promise.resolve(files));
      const el = mount(<FileManager
        filesFetcher={ filesFetcher }
        onSearch={ onSearch }
        onUpload={ noop }
        onDelete={ noop }
      />);
      el.find('.file-manager__search-input').simulate('keydown', { which: 'E' });
      setTimeout(() => {
        expect(onSearch).toHaveBeenCalled();
      }, 1010);
    });
  });

  describe('on upload', () => {
    it('calls onUpload and adds the file to the internal list', async () => {
      const file = { name: 'Abcdefg', sizeInBytes: 12321, id: 'saoethus' };
      const mockFile = { name: 'lmnopqrs', size: 32131, id: 'newId' };
      const fileNew = { name: mockFile.name, sizeInBytes: mockFile.size, id: mockFile.id };
      const files = [file];
      const noop = () => jest.fn().mockReturnValue(Promise.resolve());
      const onUpload = jest.fn().mockReturnValue(Promise.resolve(fileNew));
      const filesFetcher = jest.fn().mockReturnValue(Promise.resolve(files));
      const el = mount(<FileManager
        filesFetcher={ filesFetcher }
        onSearch={ noop }
        onUpload={ onUpload }
        onDelete={ noop }
      />);
      el.instance().onUpload({ target: { files: [ mockFile ] } });
      expect(onUpload).toHaveBeenCalled();
      await Promise.resolve();
      expect(el.state('files')).toEqual([ ...files, fileNew ]);
    });
  });

  describe('on delete', () => {
    it('calls onDelete and removes the file from the internal list', async () => {
      const file = { name: 'Abcdefg', sizeInBytes: 12321, id: 'saoethus' };
      const files = [file];
      const noop = () => jest.fn().mockReturnValue(Promise.resolve());
      const onDelete = jest.fn().mockReturnValue(Promise.resolve());
      const filesFetcher = jest.fn().mockReturnValue(Promise.resolve(files));
      const el = mount(<FileManager
        filesFetcher={ filesFetcher }
        onSearch={ noop }
        onUpload={ noop }
        onDelete={ onDelete }
      />);
      el.instance().onDelete(file.id);
      expect(onDelete).toHaveBeenCalled();
      await Promise.resolve();
      expect(el.state('files')).toEqual([]);
    });
  });

  describe('the files property', () => {
    it('is set to an empty array when a non-array is passed', () => {
      const noop = () => Promise.resolve({});
      const filesFetcher = jest.fn().mockReturnValue(Promise.resolve([]));
      const createEl = val => mount(<FileManager
        files={ val }
        filesFetcher={ filesFetcher }
        onSearch={ noop }
        onUpload={ noop }
        onDelete={ noop }
      />);
      const badValues = [undefined, "a", 1, null, true, false];
      badValues.forEach(value => {
        const el = createEl(value);
        expect(el.state('files')).toEqual([]);
      });
    });
  });

  it('displays a failure message when theres one', () => {
    const noop = () => Promise.resolve({});
    const filesFetcher = jest.fn().mockReturnValue(Promise.resolve([]));
    const el = mount(<FileManager
      filesFetcher={ filesFetcher }
      onSearch={ noop }
      onUpload={ noop }
      onDelete={ noop }
    />);
    el.setState({ failureMessage: 'yikes, something wrong here' });
    expect(el.find('.file-manager-action-overlay__message').length).toEqual(1);
  });
});
