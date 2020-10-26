import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import useClipboard from '../use-clipboard';

const Component = ({ clipboard, ...props }) => {
    const [, setClipboard] = useClipboard();

    const onClick = async () => {
        try {
            await setClipboard(clipboard);
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <button onClick={onClick} {...props}>
            click to copy
        </button>
    );
};

const mockClipboard = {
    command: () => {
        Object.assign(document, {
            execCommand: jest.fn(() => true),
            createRange: () => ({
                selectNodeContents: jest.fn()
            })
        });
        Object.assign(window, {
            getSelection: () => ({
                removeAllRanges: jest.fn(),
                addRange: jest.fn()
            })
        })
    },
    async: () => {
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });
    },
    delete: () => {
        delete navigator.clipboard.writeText;
        delete document.execCommand;
        delete document.createRange;
        delete window.getSelection;
    },
};

const CLIPBOARD_CONTENT = 'any text to be copied';

describe('useClipboard', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should copy to clipboard using the clipboard API', async () => {
        mockClipboard.async();
        
        render(<Component clipboard={CLIPBOARD_CONTENT} />);
        
        fireEvent.click(screen.getByText('click to copy'));
        await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByText('click to copy'));
        await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2));
        
        mockClipboard.delete();
    });

    it('should copy to clipboard using legacy execCommand', async () => {
        mockClipboard.command();

        render(<Component clipboard={CLIPBOARD_CONTENT} />);
        
        fireEvent.click(screen.getByText('click to copy'));
        await waitFor(() => expect(document.execCommand).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByText('click to copy'));
        await waitFor(() => expect(document.execCommand).toHaveBeenCalledTimes(2));

        mockClipboard.delete();
    });

    it('should throw an error', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        render(<Component clipboard={CLIPBOARD_CONTENT} />);
        fireEvent.click(screen.getByText('click to copy'));
        
        await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    });
});
  