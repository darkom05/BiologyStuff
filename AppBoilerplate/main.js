var Modal = ReactBootstrap.Modal;
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

var ingredients = ['Брашно', 'Млеко', 'Масло', 'Сол', 'Шеќер', 'Јајца', 'Патлиџани', 'Пиперки', 'Сирење', 'Кашкавал', 'Компир', 'Месо'];
var recipes = [
    {
        id: 0,
        name: 'Pizza',
        source: 'MoiRecepti.mk',
        ingredients: [{name: 'Ketchup', quantity: 3}, {name: 'Mushrooms', quantity: 100}, {name: 'Cheese', quantity: 1}, {name: 'Bacon', quantity: 1}],
        timeToPrepare: {hours: 0, minutes: 30},
        instructions: 'Prepare and then make it in the oven. After you make it in the oven they stop preparing.'
    },
    {
        id: 1,
        name: 'Banica',
        source: 'MKRecipes.mk',
        ingredients: [{name: 'Testo', quantity: 2}, {name: 'Zelnik', quantity: 43}],
        timeToPrepare: {hours: 1, minutes: 2},
        instructions: 'The Banica is a typical Macedonian recipe that is very good and is not very good. Who knows if it is good or not? Well, the Macedonian people surely do'
    },
    {
        id: 2,
        name: 'Trololol',
        source: 'trololo.mk',
        ingredients: [{name: 'Testo', quantity: 2}, {name: 'Zelnik', quantity: 43}],
        timeToPrepare: {hours: 1, minutes: 2},
        instructions: 'The Banica is a typical Macedonian recipe that is very good and is not very good. Who knows if it is good or not? Well, the Macedonian people surely do'
    },

];

/**************************FORM COMPONENTS**************************************/
var IngredientsChooser = React.createClass({

    renderIngredientOptions: function () {
        var availableIngredients = ingredients.diff(this.props.currentIngredients.map(function(i) { return i.name; }));
        return (
            availableIngredients.map(function(element, index) {
            return <option value={element} key={index}>{element}</option>
        }, this))
    },

    onChange: function () {
        this.props.onChange();
        ReactDOM.findDOMNode(this.refs.quantity).value = '';
    },

    render: function() {
        return (
            <div>
                <select onChange={this.props.onIngredientChange}>
                    <option>Одбери опција</option>
                    {this.renderIngredientOptions()}
                </select>
                <label>Количина </label><input type="text" ref="quantity" onChange={this.props.onQuantityChange}/>
                <button type="button" onClick={this.onChange}>Додади состојка</button>
            </div>
        );
    }
});

var TimeToPrepareInput = React.createClass({
    render: function() {
        return (
            <span>
                <label>Време за подготовка:</label><br />
                <label>Часа:</label><input type="text" data-property="hours" onChange={this.props.onChange}/>
                <label>Минути</label><input type="text" data-property="minutes" onChange={this.props.onChange} />
            </span>
        );
    }
});


var AddRecipeForm = React.createClass({
    getInitialState: function () {
        return {name: '', source: '', ingredients: [], timeToPrepare: {hours: 0, minutes: 0}, instructions: '', selectedIngredient: '', selectedIngredientQuantity: '', formID: Math.random(), counter: recipes[recipes.length -1].id+1}
    },

    handleNameChange: function (e) {
        this.setState({name: e.target.value});
    },

    handleSourceChange: function (e) {
        this.setState({source: e.target.value});
    },

    handleInstructionsChange: function (e) {
        this.setState({instructions: e.target.value});
    },

    handleTimeToPrepareChange: function(e) {
        var propertyToChange = e.target.dataset.property;
        var newValue = parseInt(e.target.value);

        var o = Object.assign({}, this.state.timeToPrepare);
        o[propertyToChange] = newValue;
        this.setState({timeToPrepare: o});
    },

    checkNameAtLeast1IngredientAndInstructions: function () {
        if (this.state.name === '' || this.state.instructions === '' || this.state.ingredients.length === 0) {
            return false;
        } else {
            return true;
        }
    },

    resetForm: function () {
        ReactDOM.findDOMNode(this.refs.submitForm).reset;
        this.replaceState(this.getInitialState());
    },

    handleFormSubmit: function (e) {
        e.preventDefault();
        var s = this.state;


        //if (this.checkNameAtLeast1IngredientAndInstructions() === true) {
        //    recipes.push({
        //        id: this.state.counter, name: s.name, source: s.source, ingredients: s.ingredients, timeToPrepare: s.timeToPrepare, instructions: s.instructions
        //    });
        //    updateDOM();
        //    this.setState({counter: this.state.counter + 1});
        //    this.resetForm();
        //} else {
        //    alert('Your recipe should have a name, at least 1 ingredient and instructions');
        //}

        recipes.push({
            id: this.state.counter, name: s.name, source: s.source, ingredients: s.ingredients, timeToPrepare: s.timeToPrepare, instructions: s.instructions
        });
        updateDOM();
        this.setState({counter: this.state.counter + 1});
        this.resetForm();
    },

    handleIngredientChange: function(e) {
        this.setState({selectedIngredient: e.target.value});
    },

    handleIngredientQuantityChange: function (e) {
        this.setState({selectedIngredientQuantity: parseInt(e.target.value)});
    },

    handleIngredientPairChange: function(e) {
        this.setState({ingredients: this.state.ingredients.concat({name: this.state.selectedIngredient, quantity: this.state.selectedIngredientQuantity})});
    },

    handleIngredientRemoval: function (e) {
        var name = e.target.id;
        console.log(name);
        this.setState({ingredients: this.state.ingredients.filter(function(obj) { return obj.name !== name })});
    },

    renderAddedIngredients: function() {
        return this.state.ingredients.map(function (i, index) {
            return (
                <ul  key={index}>
                    <li>{i.name} {i.quantity} <button id={i.name} type="button" onClick={this.handleIngredientRemoval}>Отстрани состојка</button></li>
                </ul>
            )
        }, this)
    },

    render: function() {
        console.log(this.props);
        if (this.props.display === false) {
            return false;
        } else {
            return (
                <form onSubmit={this.handleFormSubmit} ref="submitForm" key={this.state.formID}>
                    <label>Име </label><input type="text" onChange={this.handleNameChange} /><br />
                    <label>Извор </label><input type="text" onChange={this.handleSourceChange}/><br />
                    <IngredientsChooser onIngredientChange={this.handleIngredientChange} onQuantityChange={this.handleIngredientQuantityChange} onChange={this.handleIngredientPairChange} currentIngredients={this.state.ingredients}/><br />
                    {this.renderAddedIngredients()}
                    <TimeToPrepareInput onChange={this.handleTimeToPrepareChange}/><br />
                    <label>Инструкции:</label>
                    <textarea onChange={this.handleInstructionsChange}></textarea><br />
                    <button type="submit">Додади нов рецепт</button>
                </form>
            );
        }
    }
});



/********************************************************************************/
var RecipesDisplayTable = React.createClass({
    getInitialState: function () {
        return {confirmVisibility: false, currentElementId: null };
    },

    limitIngredientsToMax: function(ingredients, maxNumber) {
        var firstX = ingredients.slice(0, maxNumber).reduce(function (total, obj) {
            var name = obj.name;
            var quantity = obj.quantity;
            return total + name + ',' + quantity + ','
        }, '').slice(0, -1);

        if (ingredients.length > maxNumber) {
            return firstX + '...';
        } else {
            return firstX;
        }
    },

    limitInstructionTextToMaxChars: function(text, maxChars) {
        return text.slice(0, maxChars);
    },

    serializeHoursMinutesObj: function(o) {
        if (o.hours === 0) {
            return o.minutes + ' минути';
        } else {
            return o.hours + ' час(a) и ' + o.minutes + ' минути';
        }
    },

    showConfirmDialog: function (e) {
        this.setState({confirmVisibility: true, currentElementId: e.target.id});
    },

    hideConfirmDialog: function () {
        this.setState({confirmVisibility: false});
    },

    handleItemDelete: function (index) {
        this.setState({confirmVisibility: false});
        console.log(this.state.currentElementId);
        this.props.onDelete(this.state.currentElementId);

    },

    renderRecipeRows: function () {
        var recipesWithoutNull = recipes.filter(function(r) {return r !== null });
        return (
            recipesWithoutNull.map(function(e, index) {
                return (
                    <tr key={index}>
                        <td>{e.id}</td>
                        <td>{e.name}</td>
                        <td>{e.source}</td>
                        <td>{e.ingredients.length}</td>
                        <td>{this.limitIngredientsToMax(e.ingredients, 3)}</td>
                        <td>{this.limitInstructionTextToMaxChars(e.instructions, 5)}</td>
                        <td>{this.serializeHoursMinutesObj(e.timeToPrepare)}</td>
                        <td><button type="button" id={e.id} onClick={this.props.onRead}>Прикажи рецепт</button></td>
                        <td><button id={e.id} onClick={this.showConfirmDialog} type="button">Избриши рецепт</button></td>
                    </tr>
                )
            }, this)
        )
    },

    render: function() {
        return (
            <div>
                <ConfirmDeleteDialog display={this.state.confirmVisibility} onClose={this.hideConfirmDialog} onDelete={this.handleItemDelete} />
                <table>
                    <thead>
                    <tr>
                        <td>Реден број</td>
                        <td>Име</td>
                        <td>Извор</td>
                        <td>Број на состојки</td>
                        <td>Први три состојки</td>
                        <td>Начин на подготовка</td>
                        <td>Време за подготовка</td>
                        <td>Прикажи</td>
                        <td>Избриши</td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderRecipeRows()}
                    </tbody>
                </table>
            </div>

        );
    }
});

var ConfirmDeleteDialog = React.createClass({
    render: function() {
        if (this.props.display === false) {
            return false;
        } else {
            return (
                <Modal show={this.props.display}>
                    <p>I AM CONFIRM DELETE DIALOG</p>
                    <button onClick={this.props.onClose}>No</button>
                    <button onClick={this.props.onDelete}>Yes</button>
                </Modal>
            );
        }

    }
});

var IndividualRecipeDisplay = React.createClass({
    getInitialState: function () {
        return { confirmDialogDisplay: false }
    },

    renderIngredientsList: function (i) {
        return (
            i.map(function(ing, index) {
                return (
                    <ul key={index}>
                        <li>{ing.quantity} {ing.name}</li>
                    </ul>
                )
            })
        )
    },

    handleDelete: function () {
        this.props.onDelete(this.props.currentRecipe.id);
        this.hideConfirmDialog();

    },

    hideConfirmDialog: function () {
        this.setState({confirmDialogDisplay: false});
    },

    showConfirmDialog: function () {
        this.setState({confirmDialogDisplay: true});
    },

    render: function() {
        if (this.props.display === false) {
            return false; // don't display anything
        } else {
            var r = this.props.currentRecipe;
            return (
                <Modal show={this.props.display}>
                    <p>Име на рецепт: {r.name}</p>
                    <p>Превземен од: {r.source}</p>
                    <p>Состојки:</p>
                    {this.renderIngredientsList(r.ingredients)}
                    <p>Начин на подготовка:</p>
                    <p>{r.instructions}</p>
                    <button onClick={this.props.onClose}>Затвори прозор</button>
                    <button onClick={this.showConfirmDialog}>Избриши рецепт</button>
                    <ConfirmDeleteDialog display={this.state.confirmDialogDisplay} onDelete={this.handleDelete} onClose={this.hideConfirmDialog} />
                </Modal>
            )
        }
    }
});



var App = React.createClass({
    getInitialState: function () {
        return {
            individualRecipeDisplay: false,
            currentRecipe: {},
            addRecipeFormDisplay: false
        }
    },

    displayIndividualRecipe: function (e) {
        var index = e.target.id;
        this.setState({individualRecipeDisplay: index, currentRecipe: recipes[index]});
    },

    hideIndividualRecipe: function () {
        this.setState({individualRecipeDisplay: false});
    },

    deleteRecipe: function (index, e) {
        recipes.splice(index, 1, null);
        this.hideIndividualRecipe();
        updateDOM();
    },

    render: function() {
        return (
            <div>
                <AddRecipeForm recipes={recipes} display={this.state.addRecipeFormDisplay}/>
                <RecipesDisplayTable recipes={recipes} onRead={this.displayIndividualRecipe} onDelete={this.deleteRecipe} />
                <IndividualRecipeDisplay display={this.state.individualRecipeDisplay} currentRecipe={this.state.currentRecipe}
                                         onClose={this.hideIndividualRecipe} onDelete={this.deleteRecipe} />
            </div>


        );
    }
});



ReactDOM.render(<App />, document.getElementById('container'));

function updateDOM() {
    ReactDOM.render(<App />, document.getElementById('container'));
}