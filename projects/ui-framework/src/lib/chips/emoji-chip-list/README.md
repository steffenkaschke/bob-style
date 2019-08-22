# example

## setup

```javascript
  import EmojiChipListModule from "bob-style";
  
```

### Inputs

|     parameter     |     type       |   default value   |   description              |
|-------------------|----------------|-------------------|----------------------------|
|   valueFormatter  |    Function    |   -               |   manipulation value function         |
|        chips      |  EmojiChip[]   |   -               |   the list of chip emoji codes w/wo number|


### Outputs

|     parameter     |     type       |   default value   |   description              |
|-------------------|----------------|-------------------|----------------------------|
|   chipClicked     |EventEmitter\<EmojiChip\>  |   -               | chip clicked send emoji code and name|


## example of code:

```html
  <b-emoji-chip-list
    [valueFormatter]="transformFn"
    [chips]="chips"
    (chipClicked)="handleChipClickClicked($event)"
> </b-emoji-chip-list>
```

