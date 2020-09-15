import React, { useEffect, useState } from 'react';
import { TextField, createStyles, CircularProgress, Button, InputBase } from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useTheme } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';
import AxioHook, { makeUseAxios } from 'axios-hooks'
import axios, { CancelTokenSource } from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CancelToken = axios.CancelToken;

const normalAxios = makeUseAxios({ axios: axios.create() })

let styles = createStyles({
    input: {
        width: '80%!important',
        paddingTop: 0,
        fontSize: '0.8rem'
    },
    inputRoot: {
        flexWrap: 'unset',
        width: '100%!important',

    },
    paper: {
        margin: 0
    },
})

const LISTBOX_PADDING = 15; // px
function renderRow(props) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    // @ts-ignore
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref && ref.current) {
            // @ts-ignore
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const itemCount = itemData.length;
    const itemSize = 50;

    const getChildSize = (child) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 50;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        // @ts-ignore
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

export const SuggestionInput = ({ onOptionSelected, onInputValueChange,options, inputValue, renderOption, placeHolder = "" }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [innerInputValue, setInnerInputValue] = useState("");

    useEffect(() => {
        setInnerInputValue(inputValue)
    },[inputValue])

    return (
        <Autocomplete
            id="combo-box-demo"
            fullWidth={true}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onInputChange={(e, v) => {
                if (v === '') return
                onInputValueChange(v)
                setSearchTerm(v)
            }}
            disableListWrap={true}
            // @ts-ignore
            ListboxComponent={ListboxComponent}
            value={innerInputValue}
            loading={open && options !== null}
            options={(options) ? options : []}
            loadingText={<></>}
            onChange={(event, value) => {
                if (!value) return

                onOptionSelected(value)
            }}
            renderOption={renderOption}
            getOptionLabel={(option) => option}
            filterOptions={x => x}
            renderInput={(params) => {
                return (
                    <InputBase
                        {...params.InputProps}
                        fullWidth={true}
                        inputProps={params.inputProps}
                        id={params.id}
                        disabled={params.disabled}
                        style={{ borderRadius: '6px' }}
                        placeholder={placeHolder}
                        value={innerInputValue}
                    />
                );
            }}
        />
    );
}
