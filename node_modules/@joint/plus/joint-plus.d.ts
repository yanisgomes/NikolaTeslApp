import {
    attributes,
    dia,
    mvc,
    g,
    shapes,
    util,
    Vectorizer
} from '@joint/core';

export * from '@joint/core';

export as namespace joint;

declare abstract class CompositePool<S extends Swimlane = Swimlane, P extends Phase = Phase> extends dia.Element {
	constructor(attributes?: CompositePool.Attributes<CompositePool.Selectors>, opt?: dia.Graph.Options);
	isHorizontal(): boolean;
	getMinimalXRange(): [
		number,
		number
	] | null;
	getMinimalYRange(): [
		number,
		number
	] | null;
	addSwimlane(swimlane: S, index?: number): void;
	removeSwimlane(swimlane: S): void;
	addPhase(phase: P, orthogonalCoord?: number): void;
	removePhase(phase: P): void;
	adjustToContainElements(swimlane: S): void;
	getSwimlanes(): S[];
	getPhases(): P[];
	getContentMargin(): number;
	getMinimumLaneSize(): number;
	getPadding(): dia.PaddingJSON;
	getSwimlanePadding(): dia.PaddingJSON;
	getSwimlaneCoordinate(): CompositePool.Coordinate;
	getSwimlaneOrthogonalCoordinate(): CompositePool.Coordinate;
	getSwimlaneDimension(): CompositePool.Dimension;
	getSwimlaneOrthogonalDimension(): CompositePool.Dimension;
	getSwimlaneStartSide(): CompositePool.StartSide;
	getSwimlaneOrthogonalStartSide(): CompositePool.StartSide;
	getSwimlaneEndSide(): CompositePool.EndSide;
	getSwimlaneOrthogonalEndSide(): CompositePool.EndSide;
	getPhasePadding(): dia.PaddingJSON;
	getPhaseCoordinate(): CompositePool.Coordinate;
	getPhaseOrthogonalCoordinate(): CompositePool.Coordinate;
	getPhaseDimension(): CompositePool.Dimension;
	getPhaseOrthogonalDimension(): CompositePool.Dimension;
	getPhaseStartSide(): CompositePool.StartSide;
	getPhaseOrthogonalStartSide(): CompositePool.StartSide;
	getPhaseEndSide(): CompositePool.EndSide;
	getPhaseOrthogonalEndSide(): CompositePool.EndSide;
	getSwimlaneInsertIndexFromPoint(point: g.PlainPoint): number;
	getElementsInOrthogonalRange(orthogonalStartCoord: number, orthogonalEndCoord: number, options?: CompositePool.InRangeOptions): dia.Element[];
	getMinimalWidth(): number;
	getMinimalHeight(): number;
	findPhaseFromOrthogonalCoord(orthogonalCoord: number): P | null;
	changeSize(direction: dia.OrthogonalDirection, dim: number | null, options?: dia.ModelSetOptions): void;
	changeSwimlaneSize(swimlane: S, direction: dia.OrthogonalDirection, dim: number | null, options?: dia.ModelSetOptions): void;
	changePhaseSize(phase: P, direction: dia.OrthogonalDirection, dim: number | null, options?: dia.ModelSetOptions): void;
	protected resizeToFitSwimlanes(options?: dia.ModelSetOptions): boolean;
	protected resizeToFitPhases(options?: dia.ModelSetOptions): boolean;
	protected fixSwimlanesDimensionToFitPhases(options?: dia.ModelSetOptions): void;
	protected fixPhasesDimensionToFitPool(options?: dia.ModelSetOptions): void;
	protected setStackingOrder(): void;
	protected setAsParent(swimlaneOrPhase: S | P): void;
	protected afterResizeBottom(): void;
	protected afterResizeTop(): void;
	protected afterResizeRight(): void;
	protected afterResizeLeft(): void;
	protected afterSwimlaneResizeBottom(swimlane: S, options?: CompositePool.AfterSwimlaneResizeOptions<S>): void;
	protected afterSwimlaneResizeTop(swimlane: S, options?: CompositePool.AfterSwimlaneResizeOptions<S>): void;
	protected afterSwimlaneResizeRight(swimlane: S, options?: CompositePool.AfterSwimlaneResizeOptions<S>): void;
	protected afterSwimlaneResizeLeft(swimlane: S, options?: CompositePool.AfterSwimlaneResizeOptions<S>): void;
	protected afterPhaseResizeBottom(phase: P, options?: CompositePool.AfterPhaseResizeOptions<P>): void;
	protected afterPhaseResizeTop(phase: P, options?: CompositePool.AfterPhaseResizeOptions<P>): void;
	protected afterPhaseResizeRight(phase: P, options?: CompositePool.AfterPhaseResizeOptions<P>): void;
	protected afterPhaseResizeLeft(phase: P, options?: CompositePool.AfterPhaseResizeOptions<P>): void;
	protected layout(options?: {
		swimlanes?: S[];
		phases?: P[];
	}): void;
	protected layoutSwimlanes(swimlanes: S[], x: number, y: number, dim: number): void;
	protected layoutPhases(phases: P[], x: number, y: number, dim: number): void;
	protected resizePhaseOrthogonalStart(phases: P[], index: number, diffOrthogonalDim: number): void;
	protected resizePhaseOrthogonalEnd(phases: P[], index: number, diffOrthogonalDim: number): void;
	static isPool(obj: any): boolean;
}
declare abstract class Phase extends dia.Element {
	constructor(attributes?: Phase.Attributes<Phase.Selectors>, opt?: dia.Graph.Options);
	abstract isHorizontal(): boolean;
	getHeaderSide(): dia.OrthogonalDirection;
	getPadding(): dia.PaddingJSON;
	getHeaderSize(): number;
	getHeaderTextMargin(): number;
	getElements(): dia.Element[];
	getElementsBBox(): g.Rect | null;
	isCompatibleWithPool(pool: CompositePool): boolean;
	static isPhase(obj: any): boolean;
}
declare abstract class SelectionRegion<G, O extends SelectionRegion.Options<G> = SelectionRegion.Options<G>> extends mvc.View<undefined, SVGElement> {
	paper: dia.Paper;
	options: O;
	constructor(options: O);
	protected abstract validatePoint(x: number, y: number): boolean;
	protected abstract addPoint(x: number, y: number): void;
	protected abstract resetPoints(): void;
	protected abstract usePoints(): G | null;
	protected abstract update(iGeometry: G): void;
	getUserSelectionAsync(): Promise<G | null>;
	getCurrentSelection(): G | null;
	draw(geometry: G | null): void;
	protected setCursor(): void;
	protected setColor(): void;
	protected beforeUserSelect(): void;
	protected afterUserSelect(): void;
	protected mount(): void;
	protected show(): void;
	protected hide(): void;
	protected onDrag(evt: dia.Event): void;
	protected onPointsChange(evt: dia.Event): void;
	protected internalToUserGeometry(iGeometry: G): G;
	protected normalizeGeometry(iGeometry: G): G;
	protected onDragEnd(evt: dia.Event): void;
	protected onDragCancel(evt: dia.Event): void;
}
declare abstract class Swimlane extends dia.Element {
	constructor(attributes?: Swimlane.Attributes<Swimlane.Selectors>, opt?: dia.Graph.Options);
	abstract isHorizontal(): boolean;
	getHeaderSide(): dia.OrthogonalDirection;
	getPadding(): dia.PaddingJSON;
	getHeaderSize(): number;
	getHeaderTextMargin(): number;
	getContentMargin(): number;
	getElements(): dia.Element[];
	getElementsBBox(): g.Rect | null;
	isCompatibleWithPool(pool: CompositePool): boolean;
	resizeToFitContent(): boolean;
	static isSwimlane(obj: any): boolean;
}
declare class Activity extends dia.Element {
	constructor(attributes?: Activity.Attributes<Activity.Selectors>, opt?: dia.Graph.Options);
	static ACTIVITY_TYPE_ICONS: IconSet;
	static ACTIVITY_MARKER_ICONS: IconSet;
}
declare class Angle extends dia.Link {
	constructor(attributes?: Angle.Attributes<Angle.Selectors>, opt?: dia.Graph.Options);
	protected getAngleText(opt?: Angle.GetAngleTextOptions): string;
}
declare class Annotation extends dia.Element {
	constructor(attributes?: Conversation.Attributes<Annotation.Selectors>, opt?: dia.Graph.Options);
}
declare class AnnotationLink extends dia.Link {
	constructor(attributes?: dia.Link.GenericAttributes<AnnotationLinkSelectors>, opt?: dia.Graph.Options);
}
declare class BPMNFreeTransform extends FreeTransform {
	constructor(options?: BPMNFreeTransform.Options);
	options: BPMNFreeTransform.Options;
}
declare class BorderedRecord extends Record$1 {
	constructor(attributes?: Record$1.Attributes<BorderedRecord.Selectors>, opt?: dia.Graph.Options);
}
declare class Choreography extends dia.Element {
	constructor(attributes?: Choreography.Attributes<Choreography.Selectors>, opt?: dia.Graph.Options);
	participants: string[];
	participantHeight: number;
	initiatingParticipantIndex: number;
	protected anyHasChanged(attributes: string[]): boolean;
	protected onChange(flags?: any): void;
	protected buildParticipantMarkup(id: number, label: string, initiating: boolean): dia.MarkupNodeJSON;
	protected buildSubProcessMarkup(): dia.MarkupNodeJSON;
	protected buildMarkup(flags?: any): void;
}
declare class Clipboard extends mvc.Collection<mvc.Model> {
	constructor(opt?: Clipboard.Options);
	defaults: Clipboard.Options;
	cid: string;
	/**
	 * This function returns the elements and links from the original graph that were copied. This is useful for implements
	 * the Cut operation where the original cells should be removed from the graph. `selection` contains
	 * elements that should be copied to the clipboard. Note that with these elements, also all the associated
	 * links are copied. That's why we also need the `graph` parameter, to find these links.
	 */
	copyElements(selection: mvc.Collection<dia.Cell> | Array<dia.Cell>, graph: dia.Graph, opt?: Clipboard.BaseOptions): Array<dia.Cell>;
	/**
	 * Same logic as per `copyElements`, but elements are removed from the graph
	 */
	cutElements(selection: mvc.Collection<dia.Cell> | Array<dia.Cell>, graph: dia.Graph, opt?: Clipboard.CutElementsOptions): Array<dia.Cell>;
	/**
	 * If `translate` object with `dx` and `dy` properties is passed, the copied elements will be
	 * translated by the specified amount. This is useful for e.g. the 'cut' operation where we'd like to have
	 * the pasted elements moved by an offset to see they were pasted to the paper.
	 *
	 * If `useLocalStorage` is `true`, the copied elements will be saved to the localStorage (if present)
	 * making it possible to copy-paste elements between browser tabs or sessions.
	 *
	 * `link` is attributes that will be set all links before they are added to the `graph`.
	 * This is useful for e.g. setting `z: -1` for links in order to always put them to the bottom of the paper.
	 *
	 * `addCellOptions` options for the `graph.addCells` call.
	 */
	pasteCells(graph: dia.Graph, opt?: Clipboard.PasteCellsOptions): Array<dia.Cell>;
	/**
	* `origin` option shows which point of the cells bbox will be used for pasting at the point. The default value is `center`.
	*
	* If `useLocalStorage` is `true`, the copied elements will be saved to the localStorage (if present)
	* making it possible to copy-paste elements between browser tabs or sessions.
	*
	* `link` is attributes that will be set all links before they are added to the `graph`.
	* This is useful for e.g. setting `z: -1` for links in order to always put them to the bottom of the paper.
	*
	* `addCellOptions` options for the `graph.addCells` call.
	*/
	pasteCellsAtPoint(graph: dia.Graph, point: dia.Point, opt?: Clipboard.PasteCellsAtPointOptions): Array<dia.Cell>;
	/**
	 * Stores the current cells to the localStorage.
	 */
	saveToLocalStorage(): void;
	/**
	 * Fetches the cells from the localStorage. Returns an array of cells.
	 */
	fetchCellsFromLocalStorage(cellNamespace: any): dia.Cell[];
	clear(opt?: Clipboard.BaseOptions): void;
	isEmpty(opt?: Clipboard.BaseOptions): boolean;
	protected cloneCells(cells: Array<dia.Cell>, opt: Clipboard.Options): Array<dia.Cell>;
	protected saveCells(cells: Array<dia.Cell>, opt: Clipboard.Options): void;
	protected modifyCell(cell: dia.Cell, opt: Clipboard.Options, z: number): dia.Cell;
	protected updateFromStorage(graph: dia.Graph): dia.Cell;
	protected getJSONFromStorage(): Array<dia.Cell.JSON> | null;
	protected getOriginPoint(cells: Array<dia.Cell>, graph: dia.Graph, origin: dia.PositionName): dia.Point | null;
}
declare class ColorPalette extends SelectBox {
	protected position(): void;
	static OptionsView: any;
}
declare class CommandManager extends mvc.Model<CommandManager.Options> {
	graph: dia.Graph;
	undoStack: CommandManager.Commands;
	redoStack: CommandManager.Commands;
	batchLevel: number | null;
	batchCommand: CommandManager.Commands | null;
	lastCmdIndex: number | null;
	undo(opt?: CommandManager.EventOptions): void;
	redo(opt?: CommandManager.EventOptions): void;
	cancel(opt?: CommandManager.EventOptions): void;
	reset(opt?: CommandManager.EventOptions): void;
	hasUndo(): boolean;
	hasRedo(): boolean;
	squashUndo(n?: number): void;
	squashRedo(n?: number): void;
	listen(): void;
	initBatchCommand(): void;
	storeBatchCommand(opt?: CommandManager.EventOptions): void;
	toJSON(): CommandManager.JSON;
	fromJSON(json: CommandManager.JSON, opt?: CommandManager.EventOptions): void;
	protected reduceOptions(opt: CommandManager.EventOptions): Partial<CommandManager.EventOptions>;
	protected exportBatchCommands(commands?: CommandManager.Commands): CommandManager.BatchCommand[];
	static sortBatchCommand(batchCommand: CommandManager.BatchCommand): CommandManager.BatchCommand;
	static filterBatchCommand(batchCommand: CommandManager.BatchCommand): CommandManager.BatchCommand;
	static squashCommands(commands: CommandManager.Commands, n?: number): CommandManager.Commands;
}
declare class CompositePoolView extends dia.ElementView {
}
declare class ContextToolbar extends mvc.View<undefined> {
	constructor(opt?: ContextToolbar.Options);
	options: ContextToolbar.Options;
	render(): this;
	static opened: ContextToolbar | undefined;
	static close(): void;
	// Call whenever the `options.target` changes its position.
	static update(): void;
	protected getRoot(): HTMLElement;
	protected position(): void;
	protected scale(): void;
	protected onToolPointerdown(evt: dia.Event): void;
	protected onDocumentPointerdown(evt: dia.Event): void;
	protected renderContent(): void;
	protected beforeMount(): void;
	protected delegateAutoCloseEvents(): void;
	protected undelegateAutoCloseEvents(): void;
}
declare class Conversation extends dia.Element {
	constructor(attributes?: Conversation.Attributes<Conversation.Selectors>, opt?: dia.Graph.Options);
	static CONVERSATION_MARKER_ICONS: IconSet;
}
declare class ConversationLink extends dia.Link {
	constructor(attributes?: dia.Link.GenericAttributes<ConversationLinkSelectors>, opt?: dia.Graph.Options);
}
declare class DataAssociation extends dia.Link {
	constructor(attributes?: dia.Link.GenericAttributes<DataAssociation.Selectors>, opt?: dia.Graph.Options);
}
declare class DataObject extends dia.Element {
	constructor(attributes?: DataObject.Attributes<DataObject.Selectors>, opt?: dia.Graph.Options);
	static DATA_OBJECT_TYPE_ICONS: IconSet;
	static DATA_OBJECT_COLLECTION_ICONS: IconSet;
}
declare class DataStore extends dia.Element {
	constructor(attributes?: DataStore.Attributes<DataStore.Selectors>, opt?: dia.Graph.Options);
	topRy(t: number, opt: any): this;
}
declare class Dialog extends mvc.View<undefined> {
	constructor(options: Dialog.Options);
	options: Dialog.Options;
	close(): this;
	open(el?: mvc.$HTMLElement): this;
	render(): this;
	protected action(evt: dia.Event): void;
	protected onDragStart(evt: dia.Event): void;
	protected onDrag(evt: dia.Event): void;
	protected onDragEnd(): void;
}
declare class Distance extends dia.Link {
	constructor(attributes?: Distance.Attributes<Distance.Selectors>, opt?: dia.Graph.Options);
	protected getDistanceText(view: dia.LinkView, opt?: Distance.LabelFormatOptions): string;
}
declare class Event_2 extends dia.Element {
	constructor(attributes?: Event_2.Attributes<Event_2.Selectors>, opt?: dia.Graph.Options);
	static EVENT_ICONS: IconSet;
}
declare class FlashMessage extends Dialog {
	constructor(options?: FlashMessage.Options);
	options: FlashMessage.Options;
	protected addToCascade(): void;
	protected removeFromCascade(): void;
	protected startCloseAnimation(): void;
	protected startOpenAnimation(): void;
	static padding: 15;
	static open(content: any, title?: any, opt?: FlashMessage.Options): void;
	static close(): void;
	open(): this;
	close(): this;
}
declare class Flow extends dia.Link {
	constructor(attributes?: Flow.Attributes<Flow.Selectors>, opt?: dia.Graph.Options);
	static FLOW_TYPES: typeof Flow.Types;
}
declare class ForceDirected extends mvc.Model {
	static attributesName: string;
	constructor(opt: ForceDirected.Options);
	defaults(): Partial<ForceDirected.Options>;
	protected elementData: Map<dia.Cell.ID, ForceDirected.ElementData>;
	protected linkData: Map<dia.Cell.ID, ForceDirected.LinkData>;
	protected layoutArea: dia.BBox;
	protected gravityCenter: dia.Point;
	protected randomize: boolean;
	protected randomizeArea: dia.BBox;
	protected gravity: number;
	protected gravityType: ForceDirected.GravityType;
	protected weightDistribution: ForceDirected.WeightDistribution;
	protected linkStrength: number;
	protected linkDistance: number;
	protected velocityDecay: number;
	protected linkBias: boolean;
	protected charge: number;
	protected elementPoint: ForceDirected.ElementPoint;
	protected theta: number;
	protected t: number;
	protected tTarget: number;
	protected tMin: number;
	protected deltaT: number;
	protected timeQuantum: number;
	protected quadtree: Quadtree;
	protected radialForceStrength: number;
	protected useRadialForce: boolean;
	protected useRepulsiveForce: boolean;
	initialize(): void;
	start(): void;
	addElement(el: dia.Element): void;
	addLink(link: dia.Link, recalculate?: boolean): void;
	removeElement(id: dia.Cell.ID): void;
	removeLink(id: dia.Cell.ID): void;
	getElementData(id: dia.Cell.ID): ForceDirected.ElementData;
	getLinkData(id: dia.Cell.ID): ForceDirected.LinkData;
	protected getCellLayoutAttribute(cell: dia.Cell): ForceDirected.CellAttributes;
	protected calculateWeightCoeff(elementData: ForceDirected.ElementData): void;
	protected calculateBias(): void;
	hasConverged(): boolean;
	canIterate(): boolean;
	step(dt?: number): void;
	protected calculateForces(): void;
	protected calculateRepulsiveForce(): void;
	protected calculateRepulsiveForceOnNode(u: ForceDirected.ElementData, quadtree: Quadtree): {
		x: number;
		y: number;
	};
	protected calculateAttractiveForce(): void;
	protected calculateRadialForce(): void;
	protected calculateRadialForceOnNode(u: ForceDirected.ElementData, quadtree: Quadtree): {
		x: number;
		y: number;
	};
	protected calculateGravityForce(): void;
	protected applyForces(dt: number): void;
	protected initializeQuadtree(): void;
	restart(t: number): void;
	finalize(): void;
	changeElementData(id: dia.Cell.ID, data: Partial<ForceDirected.ElementData>): void;
	changeLinkData(id: dia.Cell.ID, data: Partial<ForceDirected.LinkData>): void;
	protected applyModelChanges(): void;
	protected setPosition(element: dia.Element, p: dia.Point): void;
	protected notifyEnd(): void;
	protected jiggle(): number;
}
declare class FreeTransform extends mvc.View<undefined> {
	constructor(options?: FreeTransform.Options);
	options: FreeTransform.Options;
	update(): void;
	requestUpdate(opt: {
		[key: string]: any;
	}): void;
	render(): this;
	static clear(paper: dia.Paper): void;
	protected startResizing(evt: dia.Event): void;
	protected toValidResizeDirection(direction: FreeTransform.Directions): dia.DiagonalDirection;
	protected startRotating(evt: dia.Event): void;
	protected pointermove(evt: dia.Event): void;
	protected getResizeGrid(): dia.Size;
	protected pointerup(evt: dia.Event): void;
	protected startOp(el: mvc.$HTMLElement): void;
	protected stopOp(): void;
	protected renderHandles(): void;
}
declare class Gateway extends dia.Element {
	constructor(attributes?: Gateway.Attributes<Gateway.Selectors>, opt?: dia.Graph.Options);
	static GATEWAY_ICONS: IconSet;
}
declare class Group extends dia.Element {
	constructor(attributes?: Group.Attributes<Group.Selectors>, opt?: dia.Graph.Options);
}
declare class HTMLSelectionFrameList extends OverlaySelectionFrameList<HTMLSelectionFrameList.Options, HTMLSelectionFrameList.Item> {
	itemStyle(cell: dia.Cell): Partial<CSSStyleDeclaration>;
}
declare class HTMLSelectionWrapper extends SelectionWrapper<HTMLDivElement> {
	constructor(options?: HTMLSelectionWrapper.Options);
	options: HTMLSelectionWrapper.Options;
	updateBoxContent(): void;
}
declare class Halo extends mvc.View<undefined> {
	constructor(options?: Halo.Options);
	options: Halo.Options;
	extendHandles(props: Halo.Handle): void;
	addHandles(handles: Halo.Handle[]): this;
	addHandle(handle: Halo.Handle): this;
	removeHandles(): this;
	removeHandle(name: string): this;
	changeHandle(name: string, handle: Partial<Halo.Handle>): this;
	hasHandle(name: string): boolean;
	getHandle(name: string): Halo.Handle | undefined;
	toggleHandle(name: string, selected?: boolean): this;
	selectHandle(name: string): this;
	deselectHandle(name: string): this;
	deselectAllHandles(): this;
	toggleState(toggleName: string): void;
	isOpen(toggleName: string): boolean;
	isRendered(): boolean;
	render(): this;
	static clear(paper: dia.Paper): void;
	protected update(): void;
	protected onHandlePointerDown(evt: dia.Event): void;
	protected onPieTogglePointerDown(evt: dia.Event): void;
	protected pointermove(evt: dia.Event): void;
	protected pointerup(evt: dia.Event): void;
	protected toggleFork(): void;
	protected canFork(): boolean;
	protected cloneCell(cell: dia.Cell, opt: {
		[key: string]: any;
	}): dia.Cell;
	static getDefaultHandle(name: Halo.DefaultHandles): Halo.Handle;
}
declare class HeaderedHorizontalPool extends HorizontalPool {
	constructor(attributes?: HeaderedCompositePool.Attributes<HeaderedCompositePool.Selectors>, opt?: dia.Graph.Options);
	getHeaderSide(): dia.OrthogonalDirection;
	getHeaderSize(): number;
	getHeaderTextMargin(): number;
}
declare class HeaderedHorizontalPoolView extends HorizontalPoolView {
}
declare class HeaderedPool extends Pool {
	constructor(attributes?: Pool.Attributes<HeaderedPool.Selectors>, opt?: dia.Graph.Options);
}
declare class HeaderedPoolView extends PoolView {
}
declare class HeaderedRecord extends Record$1 {
	constructor(attributes?: Record$1.Attributes<HeaderedRecord.Selectors>, opt?: dia.Graph.Options);
}
declare class HeaderedVerticalPool extends VerticalPool {
	constructor(attributes?: HeaderedCompositePool.Attributes<HeaderedCompositePool.Selectors>, opt?: dia.Graph.Options);
	getHeaderSide(): dia.OrthogonalDirection;
	getHeaderSize(): number;
	getHeaderTextMargin(): number;
}
declare class HeaderedVerticalPoolView extends VerticalPoolView {
}
declare class HighlighterSelectionFrameList extends SelectionFrameList<HighlighterSelectionFrameList.Options> {
}
declare class HorizontalPhase extends Phase {
	constructor(attributes?: Phase.Attributes<Phase.Selectors>, opt?: dia.Graph.Options);
	override isHorizontal(): boolean;
}
declare class HorizontalPhaseView extends PhaseView {
}
declare class HorizontalPool extends CompositePool<HorizontalSwimlane, VerticalPhase> {
	constructor(attributes?: CompositePool.Attributes<CompositePool.Selectors>, opt?: dia.Graph.Options);
}
declare class HorizontalPoolView extends CompositePoolView {
}
declare class HorizontalSwimlane extends Swimlane {
	constructor(attributes?: Swimlane.Attributes<Swimlane.Selectors>, opt?: dia.Graph.Options);
	override isHorizontal(): boolean;
}
declare class HorizontalSwimlaneView extends SwimlaneView {
}
declare class Inspector extends mvc.View<undefined> {
	constructor(options: Inspector.Options);
	options: Inspector.Options;
	render(): this;
	updateCell(): void;
	updateCell(attrNode: mvc.$HTMLElement, attrPath: string, opt?: {
		[key: string]: any;
	}): void;
	focusField(path: string): void;
	toggleGroup(name: string): void;
	closeGroup(name: string, opt?: {
		[key: string]: any;
	}): void;
	openGroup(name: string, opt?: {
		[key: string]: any;
	}): void;
	closeGroups(): void;
	openGroups(): void;
	getGroupsState(): string[];
	storeGroupsState(): void;
	restoreGroupsState(): void;
	refreshSource(path: string): void;
	refreshSources(): void;
	static instance: Inspector | null;
	static create(container: mvc.$HTMLElement, opt?: Inspector.CreateOptions): Inspector;
	static close(): void;
	protected renderGroup(opt?: {
		[key: string]: any;
	}): HTMLDivElement;
	protected renderOwnFieldContent(opt?: {
		[key: string]: any;
	}): HTMLElement[];
	protected renderOwnLabel(opt?: {
		[key: string]: any;
	}): HTMLElement[];
	protected replaceHTMLEntity(entity: any, code: any): void;
	protected renderObjectProperty(opt?: {
		[key: string]: any;
	}): HTMLElement;
	protected renderListItem(opt?: {
		[key: string]: any;
	}): HTMLElement;
	protected renderFieldContainer(opt?: {
		[key: string]: any;
	}): HTMLElement;
	protected renderTemplate(el: mvc.$Element | null, options: {
		[key: string]: any;
	}, path: string, opt?: {
		[key: string]: any;
	}): void;
	protected addListItem(evt: dia.Event): void;
	protected deleteListItem(evt: dia.Event): void;
	protected onChangeInput(evt: dia.Event): void;
	protected processInput(input: HTMLElement, opt: {
		[key: string]: any;
	}): void;
	protected onCellChange(eventName: string, cell: dia.Cell, change: any, opt: {
		[key: string]: any;
	}): void;
	protected pointerdown(evt: dia.Event): void;
	protected pointerup(): void;
	protected pointerfocusin(evt: dia.Event): void;
	protected pointerfocusout(evt: dia.Event): void;
	protected onGroupLabelClick(evt: dia.Event): void;
	protected renderFieldContent(options: {
		[key: string]: any;
	}, path: string, value: any): HTMLElement[];
	protected onContentEditableBlur(evt: dia.Event): void;
}
declare class Keyboard {
	constructor(options?: Keyboard.Options);
	options: Keyboard.Options;
	on(evt: string | object, callback?: ((evt: dia.Event) => void) | any, context?: any): this;
	off(evt: string | object, callback?: ((evt: dia.Event) => void) | any, context?: any): this;
	enable(): void;
	disable(): void;
	isActive(name: string, evt: Keyboard.Event): boolean;
	isKeyPrintable(evt: Keyboard.Event): boolean;
	isConsumerElement(evt: Keyboard.Event): boolean;
	static keyMap: {
		[key: string]: number;
	};
	static modifiers: {
		[key: number]: string;
	};
	static modifierMap: {
		[key: string]: number;
	};
	static charCodeAlternatives: {
		[key: number]: string;
	};
	static eventNamesMap: {
		[event: string]: string;
	};
}
declare class Knob extends Pie {
	constructor(attributes?: Knob.Attributes, opt?: {
		[key: string]: any;
	});
}
declare class KnobView extends dia.ElementView {
}
declare class Lightbox extends Dialog {
	constructor(options?: Lightbox.Options);
	options: Lightbox.Options;
	open(): this;
	positionAndScale(): void;
	close(): this;
	startCloseAnimation(): void;
	startOpenAnimation(): void;
}
declare class Matrix extends dia.Element {
	cellMarkup: string;
	labelMarkup: string;
	gridLineMarkup: string;
	constructor(attributes?: Matrix.Attributes, opt?: {
		[key: string]: any;
	});
}
declare class MatrixView extends dia.ElementView {
}
declare class Navigator extends mvc.View<undefined> {
	constructor(options?: Navigator.Options);
	options: Navigator.Options;
	render(): this;
	updateCurrentView(): void;
	updatePaper(): void;
	toggleUseContentBBox(useContentBBox: Navigator.UseContentBBox): void;
	freeze(opt?: dia.Paper.FreezeOptions): void;
	unfreeze(opt?: dia.Paper.UnfreezeOptions): void;
}
declare class OverlaySelectionFrameList<O extends OverlaySelectionFrameList.Options, I = OverlaySelectionFrameList.Item<SVGElement | HTMLElement>> extends SelectionFrameList<O> {
	DEFAULT_PADDING: number;
	DEFAULT_ROTATE: boolean;
	protected renderItem(cell: dia.Cell): void;
	protected updateItem(item: I): void;
	protected transformItem(item: I): void;
	protected mountItem(item: I): void;
	protected getCellUnrotatedBBox(cell: dia.Cell): g.Rect | null;
	protected addCellBBoxPadding(bbox: g.Rect, cell: dia.Cell): void;
	protected _updateItemTranslation(item: I, dx: number, dy: number): void;
	protected _updateItemBoundingBox(item: I, bbox: g.Rect): void;
	protected _updateItemTransformation(item: I, rotate: boolean): void;
	protected _updateItem(item: I, cell: dia.Cell): void;
}
declare class PaperScroller extends mvc.View<undefined> {
	transitionClassName: string;
	transitionEventName: string;
	constructor(opt?: PaperScroller.Options);
	options: PaperScroller.Options;
	lock(): this;
	unlock(): this;
	render(): this;
	setCursor(cursor: string): this;
	clientToLocalPoint(x: number, y: number): g.Point;
	localToBackgroundPoint(x: number, y: number): g.Point;
	center(opt?: {
		[key: string]: any;
	}): this;
	center(x: number, y?: number, opt?: {
		[key: string]: any;
	}): this;
	centerContent(opt?: {
		[key: string]: any;
	}): this;
	centerElement(element: dia.Element, opt?: {
		[key: string]: any;
	}): this;
	positionContent(positionName: string, opt?: {
		[key: string]: any;
	}): this;
	positionElement(element: dia.Element, positionName: string, opt?: {
		[key: string]: any;
	}): this;
	positionRect(rect: g.Rect, positionName: string, opt?: {
		[key: string]: any;
	}): this;
	positionPoint(point: g.Point, x: number | string, y: number | string, opt?: {
		[key: string]: any;
	}): this;
	scroll(x: number, y?: number, opt?: PaperScroller.ScrollOptions): void;
	scrollToContent(opt?: PaperScroller.ScrollOptions): void;
	scrollToElement(element: dia.Element, opt?: PaperScroller.ScrollOptions): void;
	zoom(): number;
	zoom(value: number, opt?: PaperScroller.ZoomOptions): this;
	zoomToRect(rect: dia.BBox, opt?: dia.Paper.ScaleContentOptions): this;
	zoomToFit(opt?: dia.Paper.ScaleContentOptions): this;
	transitionToPoint(point: g.Point, opt?: {
		[key: string]: any;
	}): this;
	transitionToPoint(x: number, y: number, opt?: {
		[key: string]: any;
	}): this;
	removeTransition(): this;
	transitionToRect(rect: dia.BBox, opt?: PaperScroller.TransitionToRectOptions): this;
	startPanning(evt: dia.Event): void;
	stopPanning(evt: dia.Event): void;
	getClientSize(): dia.Size;
	getVisibleArea(): g.Rect;
	isElementVisible(element: dia.Element, opt?: {
		[key: string]: any;
	}): boolean;
	isPointVisible(point: dia.Point): boolean;
	scrollWhileDragging(evt: dia.Event, x: number, y: number, opt?: PaperScroller.ScrollWhileDraggingOptions): void;
	stopScrollWhileDragging(evt: dia.Event): void;
	adjustPaper(): this;
	getPadding(): dia.PaddingJSON;
	addPadding(): this;
	computeRequiredPadding(rect: g.PlainRect): dia.PaddingJSON;
	storeCenter(): void;
	storeCenter(x: number, y: number): void;
	restoreCenter(): void;
	getCenter(): g.Point;
	computeCenter(): g.Point;
	protected onBackgroundEvent(evt: dia.Event): void;
	protected onScroll(evt: dia.Event): void;
	protected onResize(): void;
	protected onScale(sx: number, sy: number, ox: number, oy: number): void;
	protected beforePaperManipulation(): void;
	protected afterPaperManipulation(): void;
	protected isRTLDirection(): boolean;
	protected getLTRScrollLeft(): number;
	protected getScrollLeftFromLTR(scrollLeftLTR: number): number;
}
declare class PathDrawer extends mvc.View<undefined> {
	constructor(options?: PathDrawer.Options);
	options: PathDrawer.Options;
	render(): this;
	remove(): this;
	onStartPointPointerDown(evt: dia.Event): void;
	onPointerDown(evt: dia.Event): void;
	onDoubleClick(evt: dia.Event): void;
	onContextMenu(evt: dia.Event): void;
}
declare class PathEditor extends mvc.View<undefined> {
	constructor(options?: PathEditor.Options);
	options: PathEditor.Options;
	render(): this;
	remove(): this;
	adjustAnchorPoint(index: number, dx: number, dy: number, evt?: dia.Event, opt?: {
		dry?: boolean;
	}): void;
	adjustControlPoint(index: number, controlPointIndex: number, dx: number, dy: number, evt?: dia.Event, opt?: {
		dry?: boolean;
	}): void;
	adjustSegment(index: number, dx: number, dy: number, evt?: dia.Event, opt?: {
		dry?: boolean;
	}): void;
	getControlPointLockedStates(): boolean[][];
	setControlPointLockedStates(lockedStates: boolean[][]): void;
	startMoving(evt: dia.Event): void;
	move(evt: dia.Event): void;
	stopMoving(evt: dia.Event): void;
	createAnchorPoint(evt: dia.Event): void;
	removeAnchorPoint(evt: dia.Event): void;
	lockControlPoint(evt: dia.Event): void;
	addClosePathSegment(evt: dia.Event): void;
	removeClosePathSegment(evt: dia.Event): void;
	convertSegmentPath(evt: dia.Event): void;
	onAnchorPointPointerDown(evt: dia.Event): void;
	onControlPointPointerDown(evt: dia.Event): void;
	onSegmentPathPointerDown(evt: dia.Event): void;
	onPointerMove(evt: dia.Event): void;
	onPointerUp(evt: dia.Event): void;
	onAnchorPointDoubleClick(evt: dia.Event): void;
	onControlPointDoubleClick(evt: dia.Event): void;
	onSegmentPathDoubleClick(evt: dia.Event): void;
}
declare class PhaseView extends dia.ElementView {
}
declare class Pie extends dia.Element {
	sliceMarkup: string;
	sliceFillMarkup: string;
	sliceBorderMarkup: string;
	sliceInnerLabelMarkup: string;
	legendSerieMarkup: string;
	legendSliceMarkup: string;
	constructor(attributes?: Pie.Attributes, opt?: {
		[key: string]: any;
	});
	addSlice(slice: Pie.Slice, serieIndex: number, opt?: {
		[key: string]: any;
	}): void;
	editSlice(slice: Pie.Slice, sliceIndex: number, serieIndex: number, opt?: {
		[key: string]: any;
	}): void;
}
declare class PieView extends dia.ElementView {
}
declare class Plot extends dia.Element {
	tickMarkup: string;
	pointMarkup: string;
	barMarkup: string;
	markingMarkup: string;
	serieMarkup: string;
	legendItemMarkup: string;
	constructor(attributes?: Plot.Attributes, opt?: {
		[key: string]: any;
	});
	legendPosition(position: Plot.Position, opt?: {
		[key: string]: any;
	}): void;
	addPoint(p: dia.Point, serieName: string, opt?: {
		[key: string]: any;
	}): void;
	lastPoint(serieName: string): dia.Point;
	firstPoint(serieName: string): dia.Point;
}
declare class PlotView extends dia.ElementView {
}
declare class PolygonalSelectionRegion extends SelectionRegion<PolygonalSelectionRegion.Polygon, PolygonalSelectionRegion.Options> {
	protected points: Array<g.Point>;
	preinitialize(): void;
	update(polygon: PolygonalSelectionRegion.Polygon): void;
	validatePoint(x: number, y: number): boolean;
	addPoint(x: number, y: number): void;
	resetPoints(): void;
	usePoints(): PolygonalSelectionRegion.Polygon | null;
	protected simplifyPoints(): void;
}
declare class Pool extends dia.Element {
	constructor(attributes?: Pool.Attributes<Pool.Selectors>, opt?: dia.Graph.Options);
	protected metrics: Metrics;
	getLaneBBox(laneGroupId: string): g.Rect | null;
	getMilestoneBBox(milestoneGroupId: string): g.Rect | null;
	getLanesFromPoint(point: dia.Point): string[];
	getMilestoneFromPoint(point: dia.Point): string | null;
	getMinimalSize(): dia.Size;
	getLanePath(laneGroupId: string): string[];
	getLanesIds(): string[];
	getParentLaneId(laneGroupId: string): string | null;
	getLaneMetrics(laneId: string): Metrics | null;
}
declare class PoolView extends dia.ElementView {
}
declare class Popup extends ContextToolbar {
	constructor(options?: Popup.Options);
	options: Popup.Options;
	beforeMount(): void;
	renderContent(): void;
}
declare class PriorityQueue {
	constructor(opt?: PriorityQueueOptions);
	options: PriorityQueueOptions;
	isEmpty(): boolean;
	insert(priority: number, value: any, id?: number | string): void;
	peek(): any;
	peekPriority(): number;
	updatePriority(id: number | string, priority: number): void;
	remove(): any;
	bubbleUp(pos: number): void;
	bubbleDown(pos: number): void;
}
declare class QuadNode<T extends QuadNode.Rect> extends Array {
	boundary: QuadNode.Rect;
	level: number;
	protected tree: QuadTree<T>;
	objects: T[];
	constructor(boundary?: QuadNode.Rect, level?: number, tree?: QuadTree<T>);
	insert(obj: T): boolean;
	subdivide(): void;
	remove(obj: T): boolean;
	hasSubdivisions(): boolean;
	getInsertSubdivisions(rect: QuadNode.Rect): QuadNode<T>[];
	protected queryRectNoFilter(rect: QuadNode.Rect, strict: boolean): T[];
	queryRect(rect: QuadNode.Rect, strict: boolean): T[];
	queryPoint(point: QuadNode.Point, strict: boolean): T[];
	clear(): void;
	overlapsRect(rect: QuadNode.Rect): boolean;
	containsRect(rect: QuadNode.Rect): boolean;
	containsPoint(point: QuadNode.Point): boolean;
	static isRectOverlappingRect(rect1: QuadNode.Rect, rect2: QuadNode.Rect): boolean;
	static isRectInsideRect(rect1: QuadNode.Rect, rect2: QuadNode.Rect): boolean;
	static isPointInsideRect(point: QuadNode.Point, rect: QuadNode.Rect, strict?: boolean): boolean;
	static EAST: number;
	static SOUTH: number;
	static NW: number;
	static NE: number;
	static SW: number;
	static SE: number;
}
declare class QuadTree<T extends QuadTree.Object> {
	initialBoundary: QuadNode.Rect;
	maxDepth: number;
	nodeCapacity: number;
	minNodeSize: number;
	autoGrow: boolean;
	root: QuadNode<T>;
	maxLevel: number;
	constructor(initialBoundary?: QuadNode.Rect, maxDepth?: number, nodeCapacity?: number, minNodeSize?: number, autoGrow?: boolean);
	insert(obj: T): boolean;
	remove(obj: T): boolean;
	clear(): void;
	queryRect(rect: QuadNode.Rect, strict?: boolean): T[];
	queryPoint(point: QuadNode.Point, strict?: boolean): T[];
	protected grow(rect: QuadNode.Rect): void;
	protected growTowardsRect(rect: QuadNode.Rect): void;
}
declare class Quadtree {
	center: dia.Point;
	weight: number;
	radius: number;
	level: number;
	bounds: Rect;
	object: QuadtreeObject | QuadtreeObject[];
	nodes: Quadtree[];
	constructor(bounds?: Rect);
	initialize(objects: QuadtreeObject[]): void;
	split(): void;
	getIndex(object: QuadtreeObject | QuadtreeObject[]): 0 | 1 | 2 | 3;
	insert(object: QuadtreeObject | QuadtreeObject[]): void;
	clear(): void;
}
declare class RadioGroup extends mvc.View<undefined> {
	constructor(opt?: RadioGroup.Options);
	getCurrentValue(): any;
	select(index: number): void;
	selectByValue(value: any): void;
	getSelectionIndex(): number;
	setOptions(options: RadioGroup.RadioGroupOption[]): void;
	render(): this;
	protected renderOptions(): void;
	protected renderOption(option: RadioGroup.RadioGroupOption, index: number): void;
	protected onOptionClick(evt: dia.Event): void;
}
declare class RangeSelectionRegion extends SelectionRegion<RangeSelectionRegion.Range, RangeSelectionRegion.Options> {
	protected points: Array<g.Point>;
	preinitialize(): void;
	update(range: RangeSelectionRegion.Range): void;
	validatePoint(x: number, y: number): boolean;
	addPoint(x: number, y: number): void;
	createPoint(x: number, y: number): g.Point;
	resetPoints(): void;
	usePoints(): RangeSelectionRegion.Range | null;
	protected getDefaultDomain(vertical: boolean): RangeSelectionRegion.Range;
	setCursor(): void;
	normalizeGeometry([start, end]: RangeSelectionRegion.Range): RangeSelectionRegion.Range;
}
declare class Record$1 extends dia.Element {
	constructor(attributes?: Record$1.Attributes<Record$1.Selectors>, opt?: dia.Graph.Options);
	protected metrics: any;
	item(itemId: Record$1.ItemId): Record$1.Item | null;
	item(itemId: Record$1.ItemId, value: Record$1.Item, opt?: dia.Cell.Options): this;
	toggleItemCollapse(itemId: Record$1.ItemId, opt?: dia.Cell.Options): this;
	toggleItemHighlight(itemId: Record$1.ItemId, opt?: dia.Cell.Options): this;
	isItemVisible(itemId: Record$1.ItemId): boolean | null;
	isItemCollapsed(itemId: Record$1.ItemId): boolean | null;
	isItemHighlighted(itemId: Record$1.ItemId): boolean | null;
	getPadding(): dia.SidesJSON;
	getMinimalSize(): dia.Size;
	getItemPathArray(itemId: Record$1.ItemId): string[] | null;
	getItemParentId(itemId: Record$1.ItemId): Record$1.ItemId | null;
	getItemGroupIndex(itemId: Record$1.ItemId): number | null;
	getItemSide(itemId: Record$1.ItemId): Record$1.ItemSide | null;
	getItemBBox(itemId: Record$1.ItemId): g.Rect | null;
	removeItem(itemId: Record$1.ItemId): this;
	addNextSibling(siblingId: Record$1.ItemId, item: Record$1.Item, opt?: dia.Cell.Options): this;
	addPrevSibling(siblingId: Record$1.ItemId, item: Record$1.Item, opt?: dia.Cell.Options): this;
	addItemAtIndex(id: Record$1.ItemId | Record$1.GroupId, index: number, item: Record$1.Item, opt?: dia.Cell.Options): this;
	removeInvalidLinks(): dia.Link[];
	isLinkInvalid(link: dia.Link): boolean;
	getItemViewSign(itemId: Record$1.ItemId): number;
	isItemInView(itemId: Record$1.ItemId): boolean;
	isEveryItemInView(): boolean;
	getScrollTop(): number | null;
	setScrollTop(scrollTop: number | null, opt?: dia.Cell.Options): void;
	protected clampScrollTop(scrollTop: number): number;
	protected getSelector(selector: string, id: Record$1.ItemId | Record$1.GroupId): string;
	protected getGroupSelector(selector: string, ...ids: Array<Record$1.ItemId | Record$1.GroupId>): string[];
	protected getItemLabelMarkup(item: Record$1.Item, x: number, y: number, groupId: Record$1.GroupId): dia.MarkupNodeJSON;
	protected getItemBodyMarkup(item: Record$1.Item, x: number, y: number, groupId: Record$1.GroupId, overflow: number): dia.MarkupNodeJSON;
	protected getIconMarkup(item: Record$1.Item, x: number, y: number, groupId: Record$1.GroupId): dia.MarkupNodeJSON;
	protected getButtonMarkup(item: Record$1.Item, x: number, y: number, groupId: Record$1.GroupId): dia.MarkupNodeJSON;
	protected getButtonPathData(x: number, y: number, r: number, collapsed: boolean): string;
	protected getForkMarkup(itemId: Record$1.ItemId): dia.MarkupNodeJSON;
	protected getForkPathData(itemId: Record$1.ItemId): string;
	protected getItemCache(itemId: Record$1.ItemId): any;
	protected getItemCacheAttribute(itemId: Record$1.ItemId, attribute: string): any;
}
declare class RecordScrollbar extends dia.ToolView {
	constructor(opt: RecordScrollbar.Options);
	options: RecordScrollbar.Options;
	protected getTrackHeight(): number;
	protected getScale(): number;
	protected getBBox(): g.Rect;
	protected enable(): void;
	protected disable(): void;
	protected onPointerDown(evt: dia.Event): void;
	protected onPointerMove(evt: dia.Event): void;
	protected onPointerUp(evt: dia.Event): void;
}
declare class RecordView extends dia.ElementView {
	protected onItemButtonClick(evt: dia.Event): void;
}
declare class RectangularSelectionRegion extends SelectionRegion<RectangularSelectionRegion.Rect, RectangularSelectionRegion.Options> {
	protected points: Array<g.Point>;
	preinitialize(): void;
	update(rect: RectangularSelectionRegion.Rect): void;
	validatePoint(x: number, y: number): boolean;
	addPoint(x: number, y: number): void;
	resetPoints(): void;
	usePoints(): RectangularSelectionRegion.Rect | null;
	normalizeGeometry(rect: RectangularSelectionRegion.Rect): RectangularSelectionRegion.Rect;
}
declare class SVGSelectionFrameList extends OverlaySelectionFrameList<SVGSelectionFrameList.Options, SVGSelectionFrameList.Item> {
	itemAttributes(cell: dia.Cell): attributes.NativeSVGAttributes;
}
declare class SearchGraph extends dia.Graph {
	protected qt: QuadTree<SearchGraph.Object>;
	protected qtUserBoundary: dia.BBox | null;
	protected qtNodeInitialSize: number;
	protected qtNodeMinSize: number;
	protected qtMaxDepth: number;
	protected qtNodeCapacity: number;
	protected qtSearchObjectMap: Map<dia.Cell.ID, SearchGraph.Object>;
	protected qtDirty: boolean;
	protected qtLazyMode: boolean;
	protected qtUpdateAttributes: string[];
	constructor(attributes?: dia.Graph.Attributes, options?: any);
	protected onCellAdded(cell: dia.Cell): void;
	protected onCellRemoved(cell: dia.Cell): void;
	protected onCellChanged(cell: dia.Cell): void;
	protected onCollectionReset(): void;
	protected indexCell(cell: dia.Cell): void;
	protected unindexCell(cell: dia.Cell): void;
	protected reindexCell(cell: dia.Cell): void;
	protected registerSearchObject(cell: dia.Cell): SearchGraph.Object;
	protected unregisterSearchObject(cell: dia.Cell): SearchGraph.Object | null;
	protected createSearchObject(cell: dia.Cell): SearchGraph.Object;
	protected queryQuadTreeRect(rect: dia.BBox, strict?: boolean): SearchGraph.Object[];
	protected queryQuadTreePoint(point: dia.Point, strict?: boolean): SearchGraph.Object[];
	protected getInitialQuadTreeBoundary(): dia.BBox;
	protected computeInitialQuadTreeBoundary(width: number, height?: number): dia.BBox;
	protected invalidateQuadTree(): void;
	protected buildQuadTree(): void;
	setQuadTreeBoundary(boundary: null): void;
	setQuadTreeMaxDepth(maxDepth: number): void;
	setQuadTreeCapacity(capacity: number): void;
	setQuadTreeLazyMode(lazy: boolean): void;
	findElementsInArea(area: dia.BBox, options?: dia.Graph.FindInAreaOptions): dia.Element[];
	findLinksInArea(area: dia.BBox, options?: dia.Graph.FindInAreaOptions): dia.Link[];
	findCellsInArea(area: dia.BBox, options?: dia.Graph.FindInAreaOptions): dia.Cell[];
	findElementsAtPoint(point: dia.Point, options?: dia.Graph.FindAtPointOptions): dia.Element[];
	findLinksAtPoint(point: dia.Point, options?: dia.Graph.FindAtPointOptions): dia.Link[];
	findCellsAtPoint(point: dia.Point, options?: dia.Graph.FindAtPointOptions): dia.Cell[];
	findElementsUnderElement(element: dia.Element, options?: dia.Graph.FindUnderElementOptions): dia.Element[];
	findLinksUnderElement(element: dia.Element, options?: dia.Graph.FindUnderElementOptions): dia.Link[];
	findCellsUnderElement(element: dia.Element, options?: dia.Graph.FindUnderElementOptions): dia.Cell[];
	protected findUnderElement<T extends dia.Cell>(element: dia.Element, findInArea: (area: dia.BBox, opt: dia.Graph.FindInAreaOptions) => T[], findAtPoint: (point: dia.Point, opt: dia.Graph.FindAtPointOptions) => T[], options?: dia.Graph.FindUnderElementOptions): T[];
}
declare class SelectBox extends mvc.View<undefined> {
	constructor(opt?: SelectBox.Options);
	options: SelectBox.Options;
	getSelection(): SelectBox.Selection;
	getSelectionValue(selection?: SelectBox.Selection): any;
	getSelectionIndex(): number;
	select(idx: number, opt?: {
		[key: string]: any;
	}): void;
	selectByValue(value: any, opt?: {
		[key: string]: any;
	}): void;
	isOpen(): boolean;
	toggle(): void;
	open(): void;
	close(): void;
	isDisabled(): boolean;
	enable(): void;
	disable(): void;
	render(): this;
	static OptionsView: any;
	protected onToggle(evt: dia.Event): void;
	protected onOutsideClick(evt: dia.Event): void;
	protected onOptionsMouseOut(evt: dia.Event): void;
	protected onOptionSelect(idx: number, opt?: {
		[key: string]: any;
	}): void;
	protected onOptionHover(option?: {
		[key: string]: any;
	}, idx?: string): void;
	protected position(): void;
	protected calculateElOverflow(el: HTMLElement, target: any): number;
}
declare class SelectButtonGroup extends mvc.View<undefined> {
	constructor(options?: SelectButtonGroup.Options);
	options: SelectButtonGroup.Options;
	getSelection(): any;
	getSelectionValue(selection?: any): any;
	select(index: number, opt?: {
		[key: string]: any;
	}): void;
	selectByValue(value: any, opt?: {
		[key: string]: any;
	}): void;
	deselect(): void;
	isDisabled(): boolean;
	enable(): void;
	disable(): void;
	render(): this;
	protected onSelect(evt: dia.Event): void;
	protected onOptionHover(evt: dia.Event): void;
	protected onMouseOut(evt: dia.Event): void;
	protected pointerdown(evt: dia.Event): void;
	protected pointerup(): void;
}
declare class Selection extends mvc.View<dia.Cell> {
	constructor(options?: Selection.Options);
	options: Selection.Options;
	frames: SelectionFrameList;
	wrapper: SelectionWrapper;
	cancelSelection(): void;
	addHandle(opt?: Selection.Handle): this;
	stopSelecting(evt: dia.Event): void;
	removeHandle(name: string): this;
	startSelecting(evt: dia.Event): void;
	changeHandle(name: string, opt?: Selection.HandleOptions): this;
	translateSelectedElements(dx: number, dy: number): void;
	hide(): void;
	render(): this;
	destroySelectionBox(cell: dia.Cell): void;
	createSelectionBox(cell: dia.Cell): void;
	setWrapperVisibility(visibility: Selection.WrapperVisibility): void;
	protected onMousewheel(evt: dia.Event): void;
	protected onSelectionBoxPointerDown(evt: dia.Event): void;
	protected startSelectionInteraction(evt: dia.Event, cellView: dia.CellView): void;
	protected startTranslatingSelection(evt: dia.Event): void;
	protected pointerup(evt: dia.Event): void;
	protected showSelected(): void;
	protected destroyAllSelectionBoxes(): void;
	protected onHandlePointerDown(evt: dia.Event): void;
	protected pointermove(evt: dia.Event): void;
	protected onRemoveElement(element: dia.Element): void;
	protected onResetElements(elements: dia.Element): void;
	protected onAddElement(element: dia.Element): void;
	protected getWrapperBBox(): g.Rect | null;
	protected updateBoxContent(): void;
	protected cloneSelectedCells(): dia.Cell[];
	// Handles actions handlers
	protected removeElements(): void;
	protected startResizing(evt: dia.Event): void;
	protected startRotating(evt: dia.Event): void;
	protected startCloning(evt: dia.Event): void;
	protected doResize(evt: dia.Event): void;
	protected doRotate(evt: dia.Event): void;
	protected doClone(evt: dia.Event): void;
	protected stopResizing(evt: dia.Event): void;
	protected stopRotating(evt: dia.Event): void;
	protected stopCloning(evt: dia.Event): void;
	static getDefaultHandle(name: Selection.DefaultHandles): Selection.Handle;
}
declare class SelectionFrameList<O = any> {
	options: O;
	readonly selection: Selection;
	readonly paper: dia.Paper;
	constructor(options?: O);
	setSelection(selection: Selection): void;
	count(): number;
	add(cell: dia.Cell): void;
	remove(cell: dia.Cell): void;
	clear(): void;
	initialize(): void;
	getBBox(): g.Rect;
	destroy(): void;
	getCellBBox(cell: dia.Cell): g.Rect;
	update(): void;
	translate(dx: number, dy: number): void;
}
declare class SelectionWrapper<E extends Element = Element> extends mvc.View<undefined, E> {
	constructor(options?: SelectionWrapper.Options<E>);
	options: SelectionWrapper.Options<E>;
	setSelection(selection: Selection): void;
	update(): void;
	translate(dx: number, dy: number): void;
	shouldBeVisible(): boolean;
	isVisible(): boolean;
	show(): void;
	hide(): void;
	getBBox(): g.Rect | null;
	_update(bbox: g.Rect): void;
	_translate(dx: number, dy: number): void;
	_show(): void;
	_hide(): void;
}
declare class Snaplines extends mvc.View<undefined> {
	constructor(opt?: Snaplines.Options);
	options: Snaplines.Options;
	hide(): void;
	render(): this;
	isDisabled(): boolean;
	enable(): void;
	disable(): void;
	/**
	 * @deprecated in favor of `enable()`
	 */
	startListening(): void;
	protected show(opt?: {
		vertical?: number;
		horizontal?: number;
	}): void;
	protected snapWhileResizing(cell: dia.Cell, opt?: {
		[key: string]: any;
	}): void;
	protected canElementMove(cellView: dia.CellView): boolean;
	protected canElementSnap(cellView: dia.CellView, evt?: dia.Event): boolean;
	protected initializeSnapWhileMoving(elementView: dia.CellView, evt: dia.Event, x: number, y: number): void;
	protected snapWhileMoving(elementView: dia.CellView, evt: dia.Event, x: number, y: number): void;
	protected onBatchStop(data: {
		[key: string]: any;
	}): void;
	/* @deprecated */
	protected captureCursorOffset(cellView: dia.CellView, evt: dia.Event, x: number, y: number): void;
}
declare class StackLayoutView extends mvc.View<StackLayoutView.StackLayoutModel, SVGElement> {
	constructor(options: StackLayoutView.StackLayoutViewOptions);
	options: StackLayoutView.StackLayoutViewOptions;
	startListening(): void;
	dragstart(element: dia.Element, x: number, y: number): void;
	drag(element: dia.Element, x: number, y: number): void;
	dragend(element: dia.Element, x: number, y: number): void;
	cancelDrag(): void;
	canDrop(): boolean;
	protected getPreviewPosition(targetStack: StackLayout.Stack, targetElementIndex: number): g.PlainPoint;
	protected createGhost(elementView: dia.ElementView): Vectorizer;
	protected onPaperPointerdown(view: dia.ElementView, evt: dia.Event, pointerX: number, pointerY: number): void;
	protected onPaperPointermove(view: dia.ElementView, evt: dia.Event, pointerX: number, pointerY: number): void;
	protected onPaperPointerup(view: dia.ElementView, evt: dia.Event): void;
}
declare class Stencil extends mvc.View<undefined> {
	constructor(opt?: Stencil.Options);
	options: Stencil.Options;
	papers: {
		[groupName: string]: dia.Paper;
	};
	paperEvents: mvc.EventsHash;
	setPaper(paper: dia.Paper | PaperScroller): void;
	startListening(): void;
	load(groups: {
		[groupName: string]: Array<dia.Cell | mvc.ObjectHash>;
	}): void;
	load(cells: Array<dia.Cell | mvc.ObjectHash>, groupName?: string): void;
	loadGroup(cells: Array<dia.Cell | mvc.ObjectHash>, groupName?: string): void;
	getGraph(group?: string): dia.Graph;
	getPaper(group?: string): dia.Paper;
	render(): this;
	toggleGroup(name: string): void;
	closeGroup(name: string): void;
	openGroup(name: string): void;
	isGroupOpen(name: string): boolean;
	closeGroups(): void;
	openGroups(): void;
	freeze(opt?: dia.Paper.FreezeOptions): void;
	unfreeze(opt?: dia.Paper.UnfreezeOptions): void;
	cancelDrag(options?: {
		dropAnimation?: Stencil.DropAnimation;
	}): void;
	isDragCanceled(): boolean;
	startDragging(cell: dia.Cell, evt: dia.Event | Event): void;
	filter(keyword: string, matchCell?: Stencil.MatchCellMap | Stencil.MatchCellCallback): void;
	setCellCursor(cursor: string): void;
	protected positionCell(cell: dia.Cell, x: number, y: number, opt?: dia.Cell.Options): void;
	protected preparePaperForDragging(cell: dia.Cell, clientX: number, clientY: number): void;
	protected removePaperAfterDragging(clone: dia.Cell): void;
	protected onCloneSnapped(clone: dia.Cell, position: any, opt?: {
		[key: string]: any;
	}): void;
	protected onDragStart(cellView: dia.CellView, evt: dia.Event, x: number, y: number): void;
	protected onDrag(evt: dia.Event): void;
	protected onDragEnd(evt: dia.Event): void;
	protected onDragEnd(cellClone: dia.Cell): void;
	protected notifyDragEnd(cloneView: dia.CellView, evt: dia.Event, cloneArea: g.Rect, validDropTarget: boolean): void;
	protected onDrop(cloneView: dia.CellView, evt: dia.Event): void;
	protected onDropInvalid(cloneView: dia.CellView, evt: dia.Event): void;
	protected drop(clone: dia.Element, point: dia.Point): void;
	protected insideValidArea(point: dia.Point): boolean;
	protected getDropArea(el: HTMLElement): g.Rect;
	protected getCurrentDropTarget(): g.Rect | null;
	protected getCloneArea(cloneView: dia.CellView, evt: dia.Event, usePaperGrid: boolean): g.Rect;
	protected onSearch(evt: dia.Event): void;
	protected pointerFocusIn(): void;
	protected pointerFocusOut(): void;
	protected onGroupLabelClick(evt: dia.Event): void;
	protected dispose(): void;
	protected createGroupGraph(groupId: string, paperOptions: dia.Paper.Options): dia.Graph;
	protected getGroupPaperOptions(groupId: string): dia.Paper.Options;
}
declare class SwimlaneBoundary extends dia.ToolView {
	constructor(opt: SwimlaneBoundary.Options);
	options: SwimlaneBoundary.Options;
}
declare class SwimlaneTransform extends dia.ToolView {
	static TransformHandle: SwimlaneTransform.Handle;
	constructor(opt: SwimlaneTransform.Options);
	options: SwimlaneTransform.Options;
	protected onHandleChangeStart(selectedHandle: SwimlaneTransform.Handle, evt: dia.Event): void;
	protected onHandleChanging(selectedHandle: SwimlaneTransform.Handle, evt: dia.Event): void;
	protected onHandleChangeEnd(selectedHandle: SwimlaneTransform.Handle, evt: dia.Event): void;
}
declare class SwimlaneView extends dia.ElementView {
}
declare class TextEditor extends mvc.View<undefined> {
	constructor(options?: TextEditor.Options);
	options: TextEditor.Options;
	render(root?: HTMLElement): this;
	selectAll(): this;
	// Programmatically select portion of the text inside the text editor starting at selectionStart ending at selectionEnd. This method automatically swaps selectionStart and selectionEnd if they are in a wrong order.
	select(selectionStart: number, selectionEnd?: number): this;
	// Programmatically deselect all the selected text inside the text editor.
	deselect(): this;
	// Return the start character position of the current selection.
	getSelectionStart(): number | null;
	// Return the end character position of the current selection.
	getSelectionEnd(): number | null;
	// Return an object of the form { start: Number, end: Number } containing the start and end position of the current selection. Note that the start and end positions are returned normalized. This means that the start index will always be lower than the end index even though the user started selecting the text from the end back to the start.
	getSelectionRange(): TextEditor.Selection;
	// Return the number of characters in the current selection.
	getSelectionLength(): number;
	// Return the selected text.
	getSelection(): string;
	// Start the mouse text selection
	startSelecting(): void;
	// Programmatically set the caret position. If opt.silent is true, the text editor will not trigger the 'caret:change' event.
	setCaret(charNum: number, opt?: {
		[key: string]: any;
	}): this;
	// Programmatically hide the caret.
	hideCaret(): this;
	// Update the size and color of the caret
	updateCaret(): void;
	// Return the text content (including new line characters) inside the text editor.
	getTextContent(): string;
	// Return the start and end character positions for a word under charNum character position.
	getWordBoundary(charNum: number): [
		number,
		number
	] | undefined;
	// Return the start and end character positions for a URL under charNum character position. Return undefined if there was no URL recognized at the charNum index.
	getURLBoundary(charNum: number): [
		number,
		number
	] | undefined;
	// Return the number of characters in the text.
	getNumberOfChars(): number;
	// Return the character position the user clicked on. If there is no such a position found, return the last one.
	getCharNumFromEvent(evt: dia.Event | Event): number;
	// This method stores annotation attributes that will be used for the very next insert operation. This is useful, for example, when we have a toolbar and the user changes text to e.g. bold. At this point, we can just call setCurrentAnnotation({ 'font-weight': 'bold' }) and let the text editor know that once the user starts typing, the text should be bold. Note that the current annotation will be removed right after the first text operation came. This is because after that, the next inserted character will already inherit properties from the previous character which is our 'bold' text. (Rich-text specific.)
	setCurrentAnnotation(attrs: attributes.SVGAttributes): void;
	// Set annotations of the text inside the text editor. These annotations will be modified during the course of using the text editor. (Rich-text specific.)
	setAnnotations(annotations: Vectorizer.TextAnnotation | Array<Vectorizer.TextAnnotation>): void;
	// Return the annotations of the text inside the text editor. (Rich-text specific.)
	getAnnotations(): Array<Vectorizer.TextAnnotation> | undefined;
	// Get the combined (merged) attributes for a character at the position index taking into account all the annotations that apply. (Rich-text specific.)
	getCombinedAnnotationAttrsAtIndex(index: number, annotations: Vectorizer.TextAnnotation | Array<Vectorizer.TextAnnotation>): attributes.SVGAttributes;
	// Find a common annotation among all the annotations that fall into the range (an object with start and end properties - normalized). For characters that don't fall into any of the annotations, assume defaultAnnotation (default annotation does not need start and end properties). The common annotation denotes the attributes that all the characters in the range share. If any of the attributes for any character inside range differ, undefined is returned. This is useful e.g. when your toolbar needs to reflect the text attributes of a selection. (Rich-text specific.)
	getSelectionAttrs(range: TextEditor.Selection, annotations: Vectorizer.TextAnnotation): attributes.SVGAttributes;
	findAnnotationsUnderCursor(annotations: Vectorizer.TextAnnotation, selectionStart: number): Array<Vectorizer.TextAnnotation>;
	findAnnotationsInSelection(annotations: Vectorizer.TextAnnotation, selectionStart: number, selectionEnd: number): Array<Vectorizer.TextAnnotation>;
	// protected
	protected textarea: HTMLTextAreaElement;
	protected setTextElement(el: SVGElement): void;
	protected bindTextElement(el: SVGElement): void;
	protected unbindTextElement(): void;
	protected onKeydown(evt: dia.Event): void;
	protected onKeyup(evt: dia.Event): void;
	protected onCopy(evt: dia.Event): void;
	protected onCut(evt: dia.Event): void;
	protected onPaste(evt: dia.Event): void;
	protected onAfterPaste(evt: dia.Event): void;
	protected onMousedown(evt: dia.Event): void;
	protected onMousemove(evt: dia.Event): void;
	protected onMouseup(evt: dia.Event): void;
	protected onDoubleClick(evt: dia.Event): void;
	protected onTripleClick(evt: dia.Event): void;
	protected onInput(evt: dia.Event): void;
	protected onAfterKeydown(evt: dia.Event): void;
	// Class methods
	static ed: TextEditor | null;
	static edit(el?: SVGElement, opt?: TextEditor.Options): TextEditor;
	static close(): void;
	static applyAnnotations(annotations: TextEditor.Annotation[]): void;
	static getTextElement(el: SVGElement): SVGElement | undefined;
	static isLineStart(text: string, charNum: number): boolean;
	static isLineEnding(text: string, charNum: number): boolean;
	static isEmptyLine(text: string, charNum: number): boolean;
	static normalizeAnnotations(annotations: TextEditor.Annotation[], options?: any): TextEditor.Annotation[];
	static getCombinedAnnotationAttrsAtIndex(annotations: TextEditor.Annotation[], index: number, options?: any): attributes.SVGAttributes;
	static getCombinedAnnotationAttrsBetweenIndexes(annotations: TextEditor.Annotation[], start: number, end: number, options?: any): attributes.SVGAttributes;
	// Proxies
	static setCaret(charNum: number, opt?: {
		[key: string]: any;
	}): TextEditor;
	static deselect(): TextEditor;
	static selectAll(): TextEditor;
	static select(selectionStart: number, selectionEnd?: number): TextEditor;
	static getNumberOfChars(): number;
	static getCharNumFromEvent(evt: dia.Event | Event): number;
	static getWordBoundary(charNum: number): [
		number,
		number
	] | undefined;
	static getSelectionLength(): number;
	static getSelectionRange(): TextEditor.Selection;
	static getAnnotations(): TextEditor.Annotation[] | undefined;
	static setCurrentAnnotation(attrs: attributes.SVGAttributes): void;
	static getSelectionAttrs(annotations: Vectorizer.TextAnnotation | Array<Vectorizer.TextAnnotation>): attributes.SVGAttributes | null;
	static findAnnotationsUnderCursor(): Array<Vectorizer.TextAnnotation> | null;
	static findAnnotationsInSelection(): Array<Vectorizer.TextAnnotation> | null;
	/* TODO: mvc.EventsMixin add static methods */
	static on(eventName: string, callback: mvc.EventHandler, context?: any): TextEditor;
	static on(eventMap: mvc.EventMap, context?: any): TextEditor;
	static off(eventName?: string, callback?: mvc.EventHandler, context?: any): TextEditor;
	static trigger(eventName: string, ...args: any[]): TextEditor;
	static bind(eventName: string, callback: mvc.EventHandler, context?: any): TextEditor;
	static bind(eventMap: mvc.EventMap, context?: any): TextEditor;
	static unbind(eventName?: string, callback?: mvc.EventHandler, context?: any): TextEditor;
	static once(events: string, callback: mvc.EventHandler, context?: any): TextEditor;
	static once(eventMap: mvc.EventMap, context?: any): TextEditor;
	static listenTo(object: any, events: string, callback: mvc.EventHandler): TextEditor;
	static listenTo(object: any, eventMap: mvc.EventMap): TextEditor;
	static listenToOnce(object: any, events: string, callback: mvc.EventHandler): TextEditor;
	static listenToOnce(object: any, eventMap: mvc.EventMap): TextEditor;
	static stopListening(object?: any, events?: string, callback?: mvc.EventHandler): TextEditor;
}
declare class Toolbar extends mvc.View<undefined> {
	constructor(options?: Toolbar.Options);
	options: Toolbar.Options;
	on(evt: string | object, callback?: (...args: any[]) => void, context?: any): this;
	getWidgetByName(name: string): Widget;
	getWidgetByName<T extends keyof widgets.WidgetMap>(name: string): widgets.WidgetMap[T];
	getWidgets(): Array<Widget>;
	render(): this;
}
declare class Tooltip extends mvc.View<undefined> {
	constructor(options?: Tooltip.Options);
	options: Tooltip.Options;
	hide(): void;
	show(options?: Tooltip.RenderOptions): void;
	toggle(options?: Tooltip.RenderOptions): void;
	isVisible(): boolean;
	enable(): void;
	disable(): void;
	isDisabled(): boolean;
	render(options?: Tooltip.RenderOptions): this;
	protected getTooltipSettings(el: HTMLElement): {
		[key: string]: any;
	};
}
declare class TreeLayout extends mvc.Model {
	graph: dia.Graph;
	constructor(opt: TreeLayout.Options);
	options: TreeLayout.Options;
	layout(opt?: TreeLayout.UpdateOptions): this;
	layoutTree(root: dia.Element, opt?: TreeLayout.UpdateOptions): this;
	getLayoutBBox(): g.Rect | null;
	updateDirections(branch: dia.Element, rule: TreeLayout.FromToDirections, opt?: dia.Cell.Options): void;
	reconnectElement(child: dia.Element, parent: dia.Element, opt?: TreeLayout.ReconnectElementOptions): boolean;
	changeSiblingRank(el: dia.Element, siblingRank: TreeLayout.SiblingRank, opt?: dia.Cell.Options): void;
	changeDirection(el: dia.Element, direction: TreeLayout.Direction, opt?: dia.Cell.Options): void;
	getAttributeName(attribute: string): string;
	getAttribute(el: dia.Element, attribute: string): any;
	removeElement(el: dia.Element, opt?: {
		layout?: boolean;
		[key: string]: any;
	}): void;
	static directionRules: TreeLayout.DirectionRules;
}
declare class TreeLayoutView extends mvc.View<TreeLayout> {
	constructor(options?: TreeLayoutView.Options);
	options: TreeLayoutView.Options;
	render(): this;
	toggleDropping(state: boolean): void;
	isActive(): boolean;
	reconnectElement(element: dia.Element, candidate: {
		id: string;
		direction: TreeLayout.Direction;
		siblingRank: number;
	}): void;
	canInteract(handler: any): (cellView: dia.CellView, evt: dia.Event) => void;
	startDragging(elements: Array<dia.Element>): void;
	dragstart(elements: Array<dia.Element>, x: number, y: number): void;
	drag(elements: Array<dia.Element>, x: number, y: number): void;
	dragend(elements: Array<dia.Element>, x: number, y: number): void;
	cancelDrag(): void;
	canDrop(): boolean;
	show(): void;
	hide(): void;
	isDisabled(): boolean;
	enable(): void;
	disable(): void;
	/**
	 * @deprecated in favor of `enable()`
	 */
	startListening(): void;
	protected onPointerdown(elementView: dia.ElementView, evt: dia.Event, x: number, y: number): void;
	protected onPointermove(evt: dia.Event): void;
	protected onPointerup(evt: dia.Event): void;
}
declare class Validator extends mvc.Model {
	constructor(opt: Validator.Options);
	options: Validator.Options;
	/* overrides mvc.Model.prototype.validate() */
	validate(actions: any, ...callback: Array<Validator.Callback>): Validator;
}
declare class VerticalPhase extends Phase {
	constructor(attributes?: Phase.Attributes<Phase.Selectors>, opt?: dia.Graph.Options);
	override isHorizontal(): boolean;
}
declare class VerticalPhaseView extends PhaseView {
}
declare class VerticalPool extends CompositePool<VerticalSwimlane, HorizontalPhase> {
	constructor(attributes?: CompositePool.Attributes<CompositePool.Selectors>, opt?: dia.Graph.Options);
}
declare class VerticalPoolView extends CompositePoolView {
}
declare class VerticalSwimlane extends Swimlane {
	constructor(attributes?: Swimlane.Attributes<Swimlane.Selectors>, opt?: dia.Graph.Options);
	override isHorizontal(): boolean;
}
declare class VerticalSwimlaneView extends SwimlaneView {
}
declare class Widget extends mvc.View<undefined> {
	constructor(opt: mvc.ViewOptions<undefined>, refs?: Array<any>);
	enable(): void;
	disable(): void;
	isDisabled(): boolean;
	protected getReferences(): Array<any>;
	protected getReference(name: string): any;
	static create<T extends Widget>(opt: {
		[key: string]: any;
	} | string, refs?: Array<any>, widgets?: {
		[name: string]: Widget;
	}): T;
}
declare const Dijkstra: (adjacencyList: any, source: string | number, weight: (aNode: any, bNode: any) => number) => any;
declare const DisplayMode: {
	readonly RECT: "rect";
	readonly LINE: "line";
};
declare const Local: {
	prefix: string;
	insert: (collection: string, doc: any, callback: (err: Error, doc: any) => void) => void;
	find: (collection: string, query: any, callback: (err: Error, docs: Array<any>) => void) => void;
	remove: (collection: string, query: any, callback: (err: Error) => void) => void;
};
declare enum IconsFlows {
	row = "row",
	column = "column"
}
declare enum IconsOrigins {
	topLeft = "left-top",
	bottomLeft = "left-bottom",
	topRight = "right-top",
	bottomRight = "right-bottom",
	topMiddle = "top",
	bottomMiddle = "bottom",
	rightMiddle = "right",
	leftMiddle = "left",
	center = "center"
}
declare function constructTree(parent: ConstructTreeNode | any, config: ConstructTreeConfig): dia.Cell[];
declare function openAsPNG(paper: dia.Paper, opt?: RasterExportOptions): void;
declare function openAsSVG(paper: dia.Paper, opt?: SVGExportOptions): void;
declare function print(paper: dia.Paper, opt?: PrintExportOptions): void;
declare function shortestPath(graph: dia.Graph, source: dia.Element | string | number, target: dia.Element | string | number, opt?: ShortestPathOptions): Array<string | number>;
declare function toAdjacencyList(graph: dia.Graph): AdjacencyList;
declare function toCanvas(paper: dia.Paper, callback: (canvas: HTMLCanvasElement, error?: Error) => void, opt?: CanvasExportOptions): void;
declare function toCellsArray(xmlString: string, makeElement: (opt: ElementOptions, xmlNode: Node) => dia.Element, makeLink: (opt: LinkOptions, xmlEdge: Node) => dia.Link): Array<dia.Cell>;
declare function toDataURL(paper: dia.Paper, callback: (dataURL: string, error?: Error) => void, opt?: RasterExportOptions): void;
declare function toJPEG(paper: dia.Paper, callback: (dataURL: string, error?: Error) => void, opt?: RasterExportOptions): void;
declare function toPNG(paper: dia.Paper, callback: (dataURL: string, error?: Error) => void, opt?: RasterExportOptions): void;
declare function toSVG(paper: dia.Paper, callback: (svg: string, error?: Error) => void, opt?: SVGExportOptions): void;
declare interface AdjacencyList {
	[elementID: string]: dia.Cell.ID[];
}
declare interface AnnotationLinkSelectors {
	root?: attributes.SVGAttributes;
	line?: attributes.SVGPathAttributes;
	wrapper?: attributes.SVGPathAttributes;
}
declare interface BorderAttributes extends attributes.SVGPathAttributes {
	fillRule?: string;
	borderType?: borderType;
	borderStyle?: borderStyle;
	borderRadius?: number;
}
declare interface ConstructTreeConfig {
	children?: string | ((node: ConstructTreeNode | any) => ConstructTreeNode[] | any);
	makeElement: (node: ConstructTreeNode, parentElement: dia.Element | null, index: number | null) => dia.Element;
	makeLink: (parentElement: dia.Element, childElement: dia.Element) => dia.Link;
}
declare interface ConstructTreeNode {
	children?: ConstructTreeNode[];
	[property: string]: any;
}
declare interface ConversationLinkSelectors {
	root?: attributes.SVGAttributes;
	line?: attributes.SVGPathAttributes;
	outline?: attributes.SVGPathAttributes;
	wrapper?: attributes.SVGPathAttributes;
}
declare interface ElementOptions {
	id: string | number;
	label: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	z?: number;
	color?: string;
	shape?: string;
}
declare interface IconAttributes extends attributes.SVGImageAttributes {
	iconColor?: string;
	iconType?: string;
}
declare interface LinkOptions {
	source: string;
	target: string;
}
declare interface MarkersAttributes extends attributes.SVGAttributes {
	iconSize?: number;
	iconColor?: string;
	iconTypes?: string[];
	iconsOrigin?: IconsOrigins;
	iconsFlow?: IconsFlows;
}
declare interface ShortestPathOptions {
	directed?: boolean;
	weight?: (id1: string, id2: string) => number;
}
declare let BorderedRecordView: RecordView;
declare let HeaderedRecordView: RecordView;
declare namespace Activity {
	interface Selectors {
		root?: attributes.SVGAttributes;
		background?: attributes.SVGRectAttributes;
		border?: BorderAttributes;
		icon?: IconAttributes;
		label?: attributes.SVGTextAttributes;
		markers?: MarkersAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace Angle {
	enum AngleStarts {
		self = "self",
		source = "source",
		target = "target"
	}
	enum AngleDirections {
		clockwise = "clockwise",
		anticlockwise = "anticlockwise",
		small = "small",
		large = "large"
	}
	interface AngleAttributes extends attributes.SVGPathAttributes {
		angle?: number;
		angleD?: dia.LinkEnd;
		angleRadius?: number;
		anglePie?: boolean;
		angleStart?: AngleStarts;
		angleDirection?: AngleDirections;
	}
	interface AngleLabelAttributes extends attributes.SVGTextAttributes {
		angleText?: dia.LinkEnd;
		angleTextPosition?: dia.LinkEnd;
		angleTextDecimalPoints?: number;
		angleTextDistance?: number;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		line?: attributes.SVGPathAttributes;
		wrapper?: attributes.SVGPathAttributes;
		angles?: AngleAttributes;
		sourceAngle?: AngleAttributes;
		targetAngle?: AngleAttributes;
		angleLabels?: AngleLabelAttributes;
		sourceLabel?: AngleLabelAttributes;
		targetLabel?: AngleLabelAttributes;
	}
	interface GetAngleTextOptions {
		angle?: number;
		decimalPoints?: number;
	}
	interface Attributes<T> extends dia.Link.GenericAttributes<T> {
	}
}
declare namespace Annotation {
	interface BorderAttributes extends attributes.SVGPathAttributes {
		annotationD?: {
			size: number;
			side?: "left" | "top" | "right" | "bottom";
		};
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGPolygonAttributes;
		border?: BorderAttributes;
		label?: attributes.SVGTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace BPMNFreeTransform {
	export interface Options extends FreeTransform.Options {
		minLaneSize?: number;
	}
}
declare namespace BorderedRecord {
	interface Selectors extends Record$1.Selectors {
		body?: attributes.SVGRectAttributes;
	}
}
declare namespace Choreography {
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGRectAttributes;
		content?: attributes.SVGAttributes; // HTML Attributes
		fo?: attributes.SVGAttributes;
		participants?: attributes.SVGAttributes;
		participantsLabels?: attributes.SVGTextAttributes;
		participantsBodies?: attributes.SVGRectAttributes;
		initiatingParticipant?: attributes.SVGAttributes;
		initiatingParticipantLabel?: attributes.SVGTextAttributes;
		initiatingParticipantBody?: attributes.SVGRectAttributes;
		subProcess?: attributes.SVGPathAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
		participants?: string[];
		initiatingParticipant?: string | number;
		participantHeight?: number;
	}
}
declare namespace Clipboard {
	interface BaseOptions {
		useLocalStorage?: boolean;
		deep?: boolean;
		[key: string]: any;
	}
	interface Options extends BaseOptions {
		link?: {
			[key: string]: any;
		};
		origin?: dia.PositionName;
		translate?: {
			dx: number;
			dy: number;
		};
		removeCellOptions?: dia.Cell.DisconnectableOptions;
		addCellOptions?: dia.CollectionAddOptions;
		cloneCells?: (cells: Array<dia.Cell>) => Array<dia.Cell>;
	}
	interface CutElementsOptions extends BaseOptions {
		removeCellOptions?: dia.Cell.DisconnectableOptions;
	}
	interface PasteCellsAtPointOptions extends BaseOptions {
		origin?: dia.PositionName;
		link?: {
			[key: string]: any;
		};
		addCellOptions?: dia.CollectionAddOptions;
	}
	interface PasteCellsOptions extends BaseOptions {
		translate?: {
			dx: number;
			dy: number;
		};
		link?: {
			[key: string]: any;
		};
		addCellOptions?: dia.CollectionAddOptions;
	}
}
declare namespace CommandManager {
	type ReduceOptionsCallback = (value: any, name: string) => boolean;
	interface Options {
		graph: dia.Graph;
		cmdBeforeAdd?: (eventName: string, ...eventArgs: any[]) => boolean;
		cmdNameRegex?: RegExp; /* a regular expression */
		applyOptionsList?: string[] | ReduceOptionsCallback;
		revertOptionsList?: string[] | ReduceOptionsCallback;
		storeReducedOptions?: boolean;
		stackLimit?: number;
		[key: string]: any;
	}
	interface EventOptions {
		[key: string]: any;
	}
	interface CommandData {
		id: string | number;
		type: string;
		previous: any;
		next: any;
		attributes: any;
	}
	interface Command {
		batch: boolean;
		action: string;
		data: CommandData;
		options: any;
		graphChange: boolean;
	}
	type BatchCommand = Command[];
	type Commands = Array<Command | BatchCommand>;
	interface JSON {
		undo: BatchCommand[];
		redo: BatchCommand[];
		[key: string]: any;
	}
}
declare namespace CompositePool {
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGRectAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
		padding?: dia.Sides;
		contentMargin?: number;
		minimumLaneSize?: number;
	}
	type Coordinate = "x" | "y";
	type Dimension = "width" | "height";
	type StartSide = "left" | "top";
	type EndSide = "right" | "bottom";
	interface InRangeOptions {
		partial?: boolean;
	}
	interface AfterSwimlaneResizeOptions<S extends Swimlane> {
		swimlanes?: S[];
	}
	interface AfterPhaseResizeOptions<P extends Phase> {
		phases?: P[];
	}
}
declare namespace ContextToolbar {
	export interface Options extends mvc.ViewOptions<undefined> {
		padding?: number;
		autoClose?: boolean;
		vertical?: boolean;
		type?: string;
		tools?: {
			[key: string]: any;
		};
		root?: HTMLElement;
		target?: mvc.$Element | dia.Point;
		anchor?: dia.PositionName;
		position?: dia.PositionName;
		scale?: number;
	}
}
declare namespace Conversation {
	interface BorderAttributes extends attributes.SVGPathAttributes {
		fillRule?: string;
		borderType?: borderType;
		borderStyle?: borderStyle;
		borderRadius?: number;
	}
	interface IconAttributes extends attributes.SVGImageAttributes {
		iconColor?: string;
		iconType?: string;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGPolygonAttributes;
		label?: attributes.SVGTextAttributes;
		markers?: MarkersAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace DataAssociation {
	interface Selectors {
		root?: attributes.SVGAttributes;
		line?: attributes.SVGPathAttributes;
		wrapper?: attributes.SVGPathAttributes;
	}
}
declare namespace DataObject {
	interface BodyAttributes extends attributes.SVGPathAttributes {
		objectD?: number;
	}
	interface DataTypeIconAttributes extends attributes.SVGImageAttributes {
		iconColor?: string;
		iconType?: string;
	}
	interface CollectionIconAttributes extends attributes.SVGImageAttributes {
		iconColor?: string;
		collection?: string;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: BodyAttributes;
		label?: attributes.SVGTextAttributes;
		dataTypeIcon?: DataTypeIconAttributes;
		collectionIcon?: DataTypeIconAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace DataStore {
	interface BodyAttributes extends attributes.SVGPathAttributes {
		lateralArea: number;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: BodyAttributes;
		top?: attributes.SVGAttributes;
		label?: attributes.SVGTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace Dialog {
	export interface Options extends mvc.ViewOptions<undefined> {
		draggable?: boolean;
		closeButtonContent?: mvc.$HTMLElement;
		closeButton?: boolean;
		inlined?: boolean;
		modal?: boolean;
		width?: number | string;
		title?: string;
		buttons?: Array<{
			content?: mvc.$HTMLElement;
			position?: string;
			action?: string;
		}>;
		type?: string;
		content?: mvc.$HTMLElement;
	}
}
declare namespace Distance {
	interface LabelFormatOptions {
		fixed?: number;
		unit?: string;
	}
	interface LabelPositionOptions {
		offset?: number;
		ratio?: number;
	}
	interface DistanceLabelAttributes extends attributes.SVGTextAttributes {
		labelText?: LabelFormatOptions;
		labelDistance?: LabelPositionOptions;
	}
	interface DistanceAnchorLineAttributes extends attributes.SVGPathAttributes {
		dAnchor?: dia.LinkEnd;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		line?: attributes.SVGPathAttributes;
		wrapper?: attributes.SVGPathAttributes;
		anchorLines?: DistanceAnchorLineAttributes;
		sourceAnchorLine?: DistanceAnchorLineAttributes;
		targetAnchorLine?: DistanceAnchorLineAttributes;
		distanceLabel?: DistanceLabelAttributes;
	}
	interface Attributes<T> extends dia.Link.GenericAttributes<T> {
	}
}
declare namespace Event_2 {
	interface Selectors {
		root?: attributes.SVGAttributes;
		background?: attributes.SVGEllipseAttributes;
		border?: BorderAttributes;
		icon?: IconAttributes;
		label?: attributes.SVGTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace FlashMessage {
	export interface Options extends Dialog.Options {
		cascade?: boolean;
		closeAnimation?: false | {
			delay?: number;
			duration?: number;
			easing?: string;
			properties?: {
				opacity?: number;
			};
		};
		openAnimation?: {
			duration?: number;
			easing?: string;
			properties?: {
				opacity?: number;
			};
		};
	}
}
declare namespace Flow {
	enum Types {
		sequence = "sequence",
		default = "default",
		conditional = "conditional",
		message = "message"
	}
	interface LineAttributes extends attributes.SVGPathAttributes {
		flowType?: Types;
		markerFill?: string;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		line?: LineAttributes;
		wrapper?: attributes.SVGPathAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace ForceDirected {
	interface CellAttributes {
		weight?: number;
		fixed?: boolean;
		restrictX?: boolean;
		restrictY?: boolean;
		alignX?: dia.Cell.ID;
		alignY?: dia.Cell.ID;
		strength?: number;
		distance?: number;
		radius?: number;
	}
	type WeightDistribution = "uniform" | "linkCount";
	type ElementPoint = "center" | "origin";
	type GravityType = "graph" | "element" | "elementUniform";
	interface ElementData {
		weight: number;
		weightCoeff: number;
		p: dia.Point;
		v: dia.Point;
		force: dia.Point;
		absoluteForce: dia.Point;
		element: dia.Element;
		fixed: boolean;
		restrictX: boolean;
		restrictY: boolean;
		alignX: dia.Cell.ID;
		alignY: dia.Cell.ID;
		radius?: number;
	}
	interface LinkData {
		source: ElementData;
		target: ElementData;
		strength: number;
		distance: number;
		link: dia.Link;
		bias: number;
	}
	interface Options {
		graph: dia.Graph | dia.Cell[];
		layoutArea?: dia.BBox;
		weightDistribution?: WeightDistribution;
		linkDistance?: number;
		linkStrength?: number;
		randomize?: boolean;
		randomizeArea?: dia.BBox;
		gravityCenter?: dia.Point;
		gravity?: number;
		charge?: number;
		linkBias?: boolean;
		theta?: number;
		deltaT?: number;
		velocityDecay?: number;
		tMin?: number;
		tTarget?: number;
		timeQuantum?: number;
		elementPoint?: ElementPoint;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		radialForceStrength?: number;
		gravityType?: GravityType;
	}
}
declare namespace FreeTransform {
	type Directions = dia.Direction;
	type SizeConstraint = number | ((cell: dia.Cell, FreeTransform: FreeTransform, direction: Directions) => number);
	export interface Options extends mvc.ViewOptions<undefined> {
		cellView?: dia.CellView;
		cell?: dia.Cell;
		paper?: dia.Paper;
		rotateAngleGrid?: number;
		resizeGrid?: {
			width: number;
			height: number;
		};
		preserveAspectRatio?: boolean;
		minWidth?: SizeConstraint;
		minHeight?: SizeConstraint;
		maxWidth?: SizeConstraint;
		maxHeight?: SizeConstraint;
		allowOrthogonalResize?: boolean;
		allowRotation?: boolean;
		clearAll?: boolean;
		clearOnBlankPointerdown?: boolean;
		usePaperScale?: boolean;
		padding?: dia.Padding;
		resizeDirections?: Directions[];
		useBordersToResize?: boolean;
	}
}
declare namespace Gateway {
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGPolygonAttributes;
		icon?: IconAttributes;
		label?: attributes.SVGTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace GridLayout {
	type SetAttributesCallback = (element: dia.Element, attributes: dia.Element, opt: Options) => void;
	type GridMetrics = {
		rowHeights: number[];
		columnWidths: number[];
		gridX: number[];
		gridY: number[];
		bbox: g.Rect;
	};
	export interface Options {
		resizeToFit?: boolean;
		marginX?: number;
		marginY?: number;
		columns?: number;
		columnWidth?: "compact" | "auto" | number | string;
		rowHeight?: "compact" | "auto" | number | string;
		verticalAlign?: "top" | "middle" | "bottom";
		horizontalAlign?: "left" | "middle" | "right";
		columnGap?: number;
		rowGap?: number;
		deep?: boolean;
		parentRelative?: boolean;
		setAttributes?: SetAttributesCallback;
	}
	export function layout(graphOrCells: dia.Graph | Array<dia.Cell>, opt?: Options): GridMetrics;
}
declare namespace Group {
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGRectAttributes;
		wrapper?: attributes.SVGRectAttributes;
		label?: attributes.SVGTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
	}
}
declare namespace HTMLSelectionFrameList {
	type ItemStyle = Partial<CSSStyleDeclaration> | ((cell: dia.Cell, frameList: HTMLSelectionFrameList) => Partial<CSSStyleDeclaration>);
	interface Options extends OverlaySelectionFrameList.Options {
		style?: ItemStyle;
	}
	interface Item extends OverlaySelectionFrameList.Item<HTMLDivElement> {
	}
}
declare namespace HTMLSelectionWrapper {
	interface Options extends SelectionWrapper.Options<HTMLDivElement> {
		usePaperScale?: boolean;
	}
}
declare namespace Halo {
	export interface Options extends mvc.ViewOptions<undefined> {
		cellView: dia.CellView;
		loopLinkPreferredSide?: "top" | "bottom" | "left" | "right";
		loopLinkWidth?: number;
		rotateAngleGrid?: number;
		rotateEmbeds?: boolean;
		boxContent?: boolean | mvc.$HTMLElement | ((cellView: dia.CellView, boxElement: HTMLElement) => mvc.$HTMLElement);
		groups?: {
			[groupName: string]: HandleGroup;
		};
		handles?: Array<Handle>;
		clearAll?: boolean;
		clearOnBlankPointerdown?: boolean;
		useModelGeometry?: boolean;
		clone?: (cell: dia.Cell, opt: {
			[key: string]: any;
		}) => dia.Cell | Array<dia.Cell>;
		type?: "toolbar" | "overlay" | "pie" | "surrounding";
		pieSliceAngle?: number;
		pieStartAngleOffset?: number;
		pieIconSize?: number;
		pieToggles?: Array<{
			name: string;
			position: HandlePosition;
		}>;
		bbox?: dia.Point | dia.BBox | ((cellView: dia.CellView) => dia.Point | dia.BBox);
		tinyThreshold?: number;
		smallThreshold?: number;
		magnet?: (elementView: dia.ElementView, end: "source" | "target", evt: dia.Event) => SVGElement;
		makeLink?: MakeLinkCallback | null;
		makeElement?: MakeElementCallback | null;
	}
	enum HandlePosition {
		N = "n",
		NW = "nw",
		W = "w",
		SW = "sw",
		S = "s",
		SE = "se",
		E = "e",
		NE = "ne"
	}
	type EventHandler = (evt: dia.Event, x: number, y: number) => void;
	type DefaultHandles = "remove" | "resize" | "rotate" | "fork" | "clone" | "link" | "unlink" | "rotate" | "direction";
	interface MakeLinkContext {
		action: string;
		defaultAction: string;
		source: dia.Link.EndJSON;
		sourceView: dia.ElementView;
		sourceMagnet: SVGElement;
		target: dia.Link.EndJSON;
		targetView: dia.CellView | null;
		targetMagnet: SVGElement | null;
		data: any;
	}
	type MakeLinkCallback = (ctx: MakeLinkContext, evt: dia.Event, halo: Halo) => dia.Link;
	interface MakeElementContext {
		action: string;
		defaultAction: string;
		validation: boolean;
		elementView: dia.ElementView;
		data: any;
	}
	type MakeElementCallback = (ctx: MakeElementContext, evt: dia.Event, halo: Halo) => dia.Element;
	interface HandleEvents {
		pointerdown?: string | EventHandler;
		pointermove?: string | EventHandler;
		pointerup?: string | EventHandler;
		contextmenu?: string | EventHandler;
	}
	interface Handle {
		name: string;
		position?: HandlePosition | string;
		events?: HandleEvents;
		attrs?: any;
		icon?: string;
		content?: mvc.$HTMLElement;
		defaultAction?: string;
		data?: any;
		className?: string;
		hideOnDrag?: boolean;
	}
	interface HandleGroup {
		top?: string;
		left?: string;
		horizontalAlign?: "left" | "middle" | "right";
		verticalAlign?: "top" | "middle" | "bottom";
		trackDirection?: "row" | "column";
		trackCount?: number;
		gap?: string;
		className?: string;
	}
}
declare namespace HeaderedCompositePool {
	interface HeaderAttributes extends attributes.SVGRectAttributes {
		automaticHeaderAttributes?: boolean;
	}
	interface HeaderTextAttributes extends attributes.SVGTextAttributes {
		automaticHeaderTextAttributes?: boolean;
		automaticHeaderTextWrap?: boolean;
	}
	interface Selectors extends CompositePool.Selectors {
		header?: HeaderAttributes;
		headerText?: HeaderTextAttributes;
	}
	interface Attributes<T> extends CompositePool.Attributes<T> {
		headerSide?: dia.OrthogonalDirection;
		headerTextMargin?: number;
	}
}
declare namespace HeaderedPool {
	interface Selectors extends Pool.Selectors {
		header?: attributes.SVGRectAttributes;
		headerLabel?: attributes.SVGTextAttributes;
	}
}
declare namespace HeaderedRecord {
	interface Selectors extends Record$1.Selectors {
		body?: attributes.SVGRectAttributes;
		header?: attributes.SVGRectAttributes;
		headerLabel?: attributes.SVGTextAttributes;
	}
}
declare namespace HighlighterSelectionFrameList {
	type HighlighterSelector = string | ((cell: dia.Cell, frameList: HighlighterSelectionFrameList) => string);
	type HighlighterOptions = dia.HighlighterView.Options | ((cell: dia.Cell, frameList: HighlighterSelectionFrameList) => dia.HighlighterView.Options);
	interface Options {
		highlighter: typeof dia.HighlighterView<any>;
		selector?: HighlighterSelector;
		options?: HighlighterOptions;
	}
}
declare namespace Inspector {
	interface CreateOptions extends Options {
		storeGroupsState?: boolean;
		restoreGroupsState?: boolean;
		updateCellOnClose?: boolean;
	}
	type Operator = (cell: dia.Cell, propertyValue: any, ...conditionValues: any[]) => boolean;
	interface Options extends mvc.ViewOptions<undefined> {
		cellView?: dia.CellView;
		cell?: mvc.Model;
		live?: boolean;
		validateInput?: (input: any, path: string, type: string, inspector: Inspector) => boolean;
		groups?: any;
		inputs?: any;
		renderLabel?: (opt: {
			[key: string]: any;
		}, path: string, inspector: Inspector) => mvc.$HTMLElement;
		renderFieldContent?: (opt: {
			[key: string]: any;
		}, path: string, value: any, inspector: Inspector) => mvc.$HTMLElement;
		focusField?: (opt: {
			[key: string]: any;
		}, path: string, element: HTMLElement, inspector: Inspector) => void;
		getFieldValue?: (attribute: HTMLElement, type: string, inspector: Inspector) => any;
		multiOpenGroups?: boolean;
		container?: mvc.$Element;
		stateKey?: (model: dia.Cell) => string;
		operators?: {
			[operatorName: string]: Operator;
		};
	}
	interface OptionsSource {
		dependencies?: string[];
		source: (data: OptionsSourceData) => any[] | Promise<any[]>;
	}
	interface OptionsSourceData {
		model: mvc.Model;
		inspector: Inspector;
		initialized: boolean;
		path: string;
		dependencies: {
			[key: string]: {
				path: string;
				changedPath: string;
				value: any;
			};
		};
	}
}
declare namespace Keyboard {
	interface Options {
		filter?: (evt: dia.Event, keyboard: Keyboard) => boolean;
	}
	type Event = dia.Event | KeyboardEvent;
}
declare namespace Knob {
	interface Attributes extends dia.Element.GenericAttributes<Selectors> {
		value: number;
		pieHole?: number;
		min?: number;
		max?: number;
		fill?: string;
		sliceDefaults: Pie.Slice;
		serieDefaults: Pie.Serie;
	}
	interface Selectors extends Pie.Attributes {
	}
}
declare namespace Lightbox {
	export type Easing = string;
	export interface Options extends Dialog.Options {
		image: string;
		downloadable?: boolean;
		fileName?: string;
		closeAnimation?: {
			delay?: number;
			duration?: number;
			easing?: Easing;
			properties?: {
				opacity?: number;
			};
		};
		top?: number;
		windowArea?: number;
		openAnimation?: boolean;
	}
}
declare namespace Matrix {
	interface Selectors extends shapes.SVGRectSelector, shapes.SVGTextSelector, shapes.SVGPathSelector {
		".background"?: attributes.SVGAttributes;
		".cells"?: attributes.SVGAttributes;
		".foreground"?: attributes.SVGAttributes;
		".labels"?: attributes.SVGAttributes;
		".rows"?: attributes.SVGAttributes;
		".columns"?: attributes.SVGAttributes;
		".cell"?: attributes.SVGRectAttributes;
		".label"?: attributes.SVGTextAttributes;
		".grid-line"?: attributes.SVGPathAttributes;
	}
	interface Attributes extends dia.Element.GenericAttributes<Selectors> {
		cells: Array<Array<attributes.SVGRectAttributes>>;
		labels?: {
			rows?: Array<attributes.SVGTextAttributes>;
			columns?: Array<attributes.SVGTextAttributes>;
		};
	}
}
declare namespace Navigator {
	type UseContentBBox = boolean | {
		useModelGeometry?: boolean;
	};
	export interface Options extends mvc.ViewOptions<undefined> {
		paperConstructor?: typeof dia.Paper;
		paperOptions?: dia.Paper.Options;
		paperScroller?: PaperScroller;
		/**
		 * @deprecated use zoom instead
		 */
		zoomOptions?: PaperScroller.ZoomOptions;
		zoom?: boolean | PaperScroller.ZoomOptions;
		width?: number;
		height?: number;
		padding?: number;
		useContentBBox?: UseContentBBox;
		preserveAspectRatio?: boolean;
	}
}
declare namespace OverlaySelectionFrameList {
	type Margin = dia.Sides | ((cell: dia.Cell) => dia.Sides);
	type UseModelGeometryCallback = (cell: dia.Cell) => boolean;
	interface Options {
		margin?: Margin;
		rotate?: boolean;
		useModelGeometry?: boolean | UseModelGeometryCallback;
		allowCellInteraction?: boolean;
	}
	interface Item<N> {
		node: N;
		cell: dia.Cell;
		cx: number;
		cy: number;
		x: number;
		y: number;
		width: number;
		height: number;
		angle: number;
	}
}
declare namespace PaperScroller {
	type ScrollWhileDraggingOptions = {
		interval?: number;
		padding?: dia.Padding;
		scrollingFunction?: (distance: number, evt: dia.Event) => number;
	};
	interface ZoomOptions {
		absolute?: boolean;
		grid?: number;
		max?: number;
		min?: number;
		ox?: number;
		oy?: number;
	}
	interface InertiaOptions {
		friction?: number;
	}
	interface Options extends mvc.ViewOptions<undefined> {
		paper: dia.Paper;
		padding?: dia.Padding | ((paperScroller: PaperScroller) => dia.Padding);
		minVisiblePaperSize?: number;
		autoResizePaper?: boolean;
		baseWidth?: number;
		baseHeight?: number;
		contentOptions?: dia.Paper.FitToContentOptions | ((paperScroller: PaperScroller) => dia.Paper.FitToContentOptions);
		cursor?: string;
		scrollWhileDragging?: boolean | ScrollWhileDraggingOptions;
		inertia?: boolean | InertiaOptions;
		borderless?: boolean;
	}
	interface ScrollAnimationOptions {
		duration?: number;
		timingFunction?: util.timing.TimingFunction;
		complete?: () => void;
	}
	interface ScrollOptions {
		animation?: boolean | ScrollAnimationOptions;
		[key: string]: any;
	}
	interface TransitionToRectOptions {
		maxScale?: number;
		minScale?: number;
		scaleGrid?: number;
		visibility?: number;
		center?: dia.Point;
		[key: string]: any;
	}
}
declare namespace PathDrawer {
	export interface Options extends mvc.ViewOptions<undefined> {
		target: SVGSVGElement;
		pathAttributes?: attributes.NativeSVGAttributes;
		startPointMarkup?: string;
		snapRadius?: number;
		enableCurves?: boolean;
	}
}
declare namespace PathEditor {
	export interface Options extends mvc.ViewOptions<undefined> {
		pathElement: SVGPathElement;
		anchorPointMarkup?: string;
		controlPointMarkup?: string;
	}
}
declare namespace Phase {
	interface HeaderAttributes extends attributes.SVGRectAttributes {
		automaticHeaderAttributes?: boolean;
	}
	interface HeaderTextAttributes extends attributes.SVGTextAttributes {
		automaticHeaderTextAttributes?: boolean;
		automaticHeaderTextWrap?: boolean;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGRectAttributes;
		header?: HeaderAttributes;
		headerText?: HeaderTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
		headerSide?: dia.OrthogonalDirection;
		headerSize?: number;
		headerTextMargin?: number;
	}
}
declare namespace Pie {
	interface Attributes extends dia.Element.GenericAttributes<Selectors> {
		series: Serie[];
		pieHole?: number;
		serieDefaults?: Serie;
		sliceDefaults?: Slice;
	}
	interface Selectors extends shapes.SVGRectSelector, shapes.SVGTextSelector, shapes.SVGPathSelector, shapes.SVGCircleSelector {
		".background": attributes.SVGAttributes;
		".data": attributes.SVGAttributes;
		".foreground": attributes.SVGAttributes;
		".legend": attributes.SVGAttributes;
		".legend-items": attributes.SVGAttributes;
		".caption": attributes.SVGTextAttributes;
		".subcaption": attributes.SVGTextAttributes;
		".slice": attributes.SVGAttributes;
		".slice-fill": attributes.SVGPathAttributes;
		".slice-border": attributes.SVGPathAttributes;
		".slice-inner-label": attributes.SVGTextAttributes;
		".legend-serie": attributes.SVGAttributes;
		".legend-slice": attributes.SVGAttributes;
	}
	interface Serie {
		data?: Slice[];
		name?: string;
		label?: string;
		startAngle?: number;
		degree?: number;
		showLegend?: boolean;
		labelLineHeight?: number;
	}
	interface Slice {
		value: number;
		label?: string;
		fill?: string;
		innerLabel?: string;
		innerLabelMargin?: number;
		legendLabel?: string;
		legendLabelLineHeight?: number;
		legendLabelMargin?: number;
		offset?: number;
		onClickEffect?: {
			type: "enlarge" | "offset";
			offset?: number;
			scale?: number;
		};
		onHoverEffect?: {
			type: "enlarge" | "offset";
			offset?: number;
			scale?: number;
		};
	}
}
declare namespace Plot {
	type Position = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw" | "nnw" | "nn" | "nnw" | "nnw" | "nne" | "nnee" | "nee" | "ee" | "see" | "ssee" | "sse" | "ss" | "ssw" | "ssww" | "sww" | "ww" | "nww" | "nnww";
	interface Series {
		name: string;
		label?: string;
		data?: dia.Point[];
		interpolate?: "linear" | "bezier" | "step" | "stepBefore" | "stepAfter";
		bars?: boolean | {
			align?: "middle" | "left" | "right";
			barWidth: number;
			"top-rx": number;
			"top-ry": number;
		};
		showLegend?: boolean | ((serie: Plot.Series, stats: any) => boolean);
		legendLabelLineHeight?: number;
		hideFillBoundaries?: boolean;
		showRightFillBoundary?: boolean;
		fillPadding?: {
			left?: number;
			right?: number;
			bottom?: number;
		};
	}
	interface Marking {
		name: string;
		label?: string;
		start?: {
			x?: number;
			y?: number;
		};
		end?: {
			x?: number;
			y?: number;
		};
		attrs?: {
			[key: string]: any;
		};
	}
	interface Axis {
		min?: number;
		max?: number;
		tickFormat?: string | ((tickValue: number) => string);
		tickSuffix?: string | ((tickValue: number) => string);
		ticks?: number;
		tickStep?: number;
	}
	interface Attributes extends dia.Element.Attributes {
		series?: Series[];
		axis?: {
			"x-axis"?: Axis;
			"y-axis"?: Axis;
		};
		markings?: Marking[];
		padding?: dia.Padding;
		attrs?: {
			[key: string]: any;
		};
	}
}
declare namespace PolygonalSelectionRegion {
	interface Options extends SelectionRegion.Options<g.Polygon> {
		/** You can specify a tolerance range by providing a `threshold` value.
		 * Polygon points that are closer to the connection line than this value (inclusive) are removed;
		 * points that are farther from the connection line (exclusive) are kept. */
		threshold?: number;
	}
	type Polygon = g.Polygon;
}
declare namespace Pool {
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGRectAttributes;
		laneGroups?: attributes.SVGAttributes;
		laneHeaders?: attributes.SVGAttributes;
		laneLabels?: attributes.SVGAttributes;
		lanes?: attributes.SVGAttributes;
		milestoneGroups?: attributes.SVGAttributes;
		milestoneHeaders?: attributes.SVGAttributes;
		milestoneLabels?: attributes.SVGAttributes;
		milestoneLines?: attributes.SVGAttributes;
		[key: string]: any;
	}
	interface Sublane {
		label?: string;
		size?: number;
		id?: string;
		headerSize?: number;
		sublanes?: Sublane[];
	}
	interface Milestone {
		label?: string;
		size?: number;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
		lanes?: Sublane[];
		milestones?: Milestone[];
		headerSize?: number;
		milestonesSize?: number;
		padding?: dia.Padding;
	}
}
declare namespace Popup {
	export type ArrowPositionName = "top" | "left" | "bottom" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "none";
	export interface Options extends ContextToolbar.Options {
		target: mvc.$Element;
		content?: mvc.$HTMLElement | ((el: SVGElement) => void | mvc.$HTMLElement);
		arrowPosition?: ArrowPositionName;
	}
}
declare namespace QuadNode {
	interface Point {
		x: number;
		y: number;
	}
	interface Rect extends Point {
		width: number;
		height: number;
	}
}
declare namespace QuadTree {
	type Object = QuadNode.Rect;
}
declare namespace RadioGroup {
	export interface RadioGroupOption {
		content: string;
		value: any;
	}
	export interface Options extends mvc.ViewOptions<undefined> {
		name?: string;
		options?: RadioGroupOption[];
	}
}
declare namespace RangeSelectionRegion {
	interface Options extends SelectionRegion.Options<Range> {
		domain?: Range;
		constraints?: Range;
		vertical?: boolean;
		displayMode?: DisplayMode;
	}
	type Range = [
		number,
		number
	];
	type DisplayMode = typeof DisplayMode[keyof typeof DisplayMode];
}
declare namespace Record$1 {
	type ItemId = string;
	type GroupId = number;
	type ItemSide = "left" | "middle" | "right";
	interface Item {
		id?: ItemId;
		label?: string;
		icon?: string;
		collapsed?: boolean;
		height?: number;
		span?: number;
		highlighted?: boolean;
		group?: string | string[];
		items?: Item[];
	}
	interface ItemIcon {
		width?: number;
		height?: number;
		padding?: number;
	}
	interface ItemTextAttribute extends attributes.SVGAttributeTextWrap {
		textWrap?: boolean;
	}
	interface ItemLabelAttributes extends attributes.SVGTextAttributes {
		itemText?: ItemTextAttribute;
		itemHighlight?: attributes.NativeSVGAttributes;
	}
	interface ItemBodyAttributes extends attributes.SVGRectAttributes {
		itemHighlight?: attributes.NativeSVGAttributes;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		wrapper?: attributes.SVGAttributes;
		bodiesGroups?: attributes.SVGAttributes;
		labelsGroups?: attributes.SVGAttributes;
		buttonsGroups?: attributes.SVGAttributes;
		forksGroups?: attributes.SVGAttributes;
		iconsGroups?: attributes.SVGAttributes;
		// Bodies of all items
		itemBodies?: ItemBodyAttributes;
		// Bodies of a specific column
		itemBodies_0?: ItemBodyAttributes;
		itemBodies_1?: ItemBodyAttributes;
		itemBodies_2?: ItemBodyAttributes;
		// Labels of all items
		itemLabels?: ItemLabelAttributes;
		/* Labels of a specific column */
		itemLabels_0?: ItemLabelAttributes;
		itemLabels_1?: ItemLabelAttributes;
		itemLabels_2?: ItemLabelAttributes;
		// Specific Item
		// * itemBody_[itemId]?: ItemBodyAttributes;
		// * itemLabel_[itemId]?: ItemLabelAttributes;
		// Specific Column
		// * itemBodies_[n]?: ItemBodyAttributes;
		// * itemLabels_[n]?: ItemLabelAttributes;
		// * group_[n]?: attributes.SVGAttributes;
		// * bodiesGroup_[n]?: attributes.SVGGAttributes;
		// * labelsGroup_[n]?: attributes.SVGAttributes;
		// * buttonsGroup_[n]?: attributes.SVGAttributes;
		// * forksGroup_[n]?: attributes.SVGAttributes;
		// * iconsGroup_[n]?: attributes.SVGAttributes;
		[key: string]: any;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
		items?: Item[][];
		itemHeight?: number;
		itemOffset?: number;
		itemMinLabelWidth?: number;
		itemButtonSize?: number;
		itemIcon?: ItemIcon;
		itemOverflow?: boolean;
		itemBelowViewSelector?: string;
		itemAboveViewSelector?: string;
		scrollTop?: number | null;
		padding?: dia.Padding;
	}
}
declare namespace RecordScrollbar {
	export interface Options extends dia.ToolView.Options {
		margin?: number;
		width?: number;
		rightAlign?: boolean;
	}
}
declare namespace RectangularSelectionRegion {
	interface Options extends SelectionRegion.Options<g.Rect> {
	}
	type Rect = g.Rect;
}
declare namespace SVGSelectionFrameList {
	type ItemAttributes = attributes.NativeSVGAttributes | ((cell: dia.Cell, frameList: SVGSelectionFrameList) => attributes.NativeSVGAttributes);
	interface Options extends OverlaySelectionFrameList.Options {
		layer?: dia.Paper.Layers;
		attributes?: ItemAttributes;
	}
	interface Item extends OverlaySelectionFrameList.Item<SVGRectElement> {
	}
}
declare namespace SearchGraph {
	interface Object extends QuadTree.Object {
		id: dia.Cell.ID;
		link: boolean;
	}
}
declare namespace SelectBox {
	export interface Selection {
		[key: string]: any;
	}
	type OpenPolicy = "selected" | "auto" | "above" | "coverAbove" | "below" | "coverBelow";
	export interface Options extends mvc.ViewOptions<undefined> {
		icon?: string;
		content?: mvc.$HTMLElement;
		options?: Array<Selection>;
		target?: mvc.$HTMLElement;
		width?: number;
		openPolicy?: OpenPolicy;
		selectBoxOptionsClass?: string | (() => string);
		placeholder?: string;
		disabled?: boolean;
		selected?: number;
		keyboardNavigation?: boolean;
	}
}
declare namespace SelectButtonGroup {
	export interface Options extends mvc.ViewOptions<undefined> {
		options?: Array<{
			content?: mvc.$HTMLElement;
			value?: any;
			attrs?: object;
			selected?: boolean;
			icon?: string;
			iconSelected?: string;
			buttonWidth?: number;
			buttonHeight?: number;
			iconWidth?: number;
			iconHeight?: number;
		}>;
		disabled?: boolean;
		multi?: boolean;
		selected?: number | number[];
		singleDeselect?: boolean;
		noSelectionValue?: any;
		width?: number;
		buttonWidth?: number;
		buttonHeight?: number;
		iconWidth?: number;
		iconHeight?: number;
	}
}
declare namespace Selection {
	interface Options extends mvc.ViewOptions<undefined> {
		paper: dia.Paper | PaperScroller;
		graph?: dia.Graph;
		boxContent?: boolean | mvc.$HTMLElement | ((boxElement: HTMLElement) => mvc.$HTMLElement);
		handles?: Array<Handle>;
		useModelGeometry?: boolean;
		strictSelection?: boolean;
		selectLinks?: boolean;
		rotateAngleGrid?: number;
		allowTranslate?: boolean;
		preserveAspectRatio?: boolean;
		collection?: any;
		filter?: ((cell: dia.Cell) => boolean) | Array<string | dia.Cell>;
		translateConnectedLinks?: ConnectedLinksTranslation;
		allowCellInteraction?: boolean;
		frames?: SelectionFrameList;
		wrapper?: boolean | HTMLSelectionWrapper.Options | SelectionWrapper;
	}
	interface HandleOptions {
		position?: HandlePosition;
		events?: HandleEvents;
		attrs?: any;
		icon?: string;
		content?: mvc.$HTMLElement;
	}
	interface Handle extends HandleOptions {
		name: string;
	}
	enum HandlePosition {
		N = "n",
		NW = "nw",
		W = "w",
		SW = "sw",
		S = "s",
		SE = "se",
		E = "e",
		NE = "ne"
	}
	enum ConnectedLinksTranslation {
		NONE = "none",
		SUBGRAPH = "subgraph",
		ALL = "all"
	}
	type EventHandler = (evt: dia.Event, x: number, y: number) => void;
	type DefaultHandles = "remove" | "rotate" | "resize" | "clone";
	interface HandleEvents {
		pointerdown?: string | EventHandler;
		pointermove?: string | EventHandler;
		pointerup?: string | EventHandler;
		contextmenu?: string | EventHandler;
	}
	type WrapperVisibility = SelectionWrapper.Visibility;
}
declare namespace SelectionRegion {
	interface Options<G> extends mvc.ViewOptions<undefined, SVGElement> {
		paper: dia.Paper;
		layer?: dia.Paper.Layers;
		normalize?: boolean;
		onChange?: (geometry: G, evt: dia.Event) => void;
	}
}
declare namespace SelectionWrapper {
	type Visibility = boolean | ((selection: Selection) => boolean);
	interface Options<E extends Element> extends mvc.ViewOptions<undefined, E> {
		margin?: number;
		visibility?: Visibility;
		/* @deprecated */
		legacy?: boolean;
	}
}
declare namespace Snaplines {
	export type SnaplinesType = "move" | "resize";
	export interface AdditionalSnapPointsOptions {
		type: SnaplinesType;
	}
	export interface Options extends mvc.ViewOptions<undefined> {
		paper: dia.Paper;
		distance?: number;
		filter?: string[] | dia.Cell[] | (() => string[] | dia.Cell[]);
		usePaperGrid?: boolean;
		canSnap?: (this: Snaplines, elementView: dia.ElementView) => boolean;
		additionalSnapPoints?: (this: Snaplines, elementView: dia.ElementView, options: AdditionalSnapPointsOptions) => Array<dia.Point>;
	}
}
declare namespace StackLayout {
	type SetAttributesCallback = (element: dia.Element, attributes: dia.Element.Attributes, opt?: dia.Graph.Options) => void;
	export enum Directions {
		TopBottom = "TB",
		BottomTop = "BT",
		LeftRight = "LR",
		RightLeft = "RL"
	}
	export enum Alignments {
		Start = "start",
		Middle = "middle",
		End = "end"
	}
	export interface StackLayoutOptions {
		direction: Directions;
		alignment?: Alignments;
		stackSize: number;
		stackGap?: number;
		stackElementGap?: number;
		stackCount?: number;
		topLeft?: dia.Point;
		bottomLeft?: dia.Point;
		topRight?: dia.Point;
		bottomRight?: dia.Point;
		setAttributes?: SetAttributesCallback;
		stackIndexAttributeName?: string;
		stackElementIndexAttributeName?: string;
	}
	export interface Stack {
		bbox: g.Rect;
		elements: dia.Element[];
		index: number;
	}
	export interface StackLayoutResult {
		bbox: g.Rect;
		stacks: Stack[];
	}
	export function layout(model: dia.Graph | dia.Element[], options?: StackLayoutOptions): StackLayoutResult;
}
declare namespace StackLayoutView {
	export interface PreviewCallbackOptions {
		sourceStack: StackLayout.Stack;
		sourceElement: dia.Element;
		targetStack: StackLayout.Stack;
		insertElementIndex: number;
		invalid: boolean;
	}
	export interface ValidateCallbackOptions {
		sourceStack: StackLayout.Stack;
		sourceElement: dia.Element;
		targetStack: StackLayout.Stack;
		insertElementIndex: number;
	}
	export interface ModifyInsertElementIndexOptions {
		sourceStack: StackLayout.Stack;
		sourceElement: dia.Element;
		targetStack: StackLayout.Stack;
		insertElementIndex: number;
	}
	export type InsertElementOptions = ModifyInsertElementIndexOptions;
	export type PreviewCallback = (options: PreviewCallbackOptions, view: StackLayoutView) => SVGElement;
	export type ValidateMovingCallback = (options: ValidateCallbackOptions, view: StackLayoutView) => boolean;
	export type ModifyInsertElementIndexCallback = (options: ModifyInsertElementIndexOptions, point: g.Point, view: StackLayoutView) => number;
	export type InsertElementCallback = (options: InsertElementOptions, view: StackLayoutView) => void;
	export type CanInteractCallback = (elementView: dia.ElementView, view: StackLayoutView, evt: dia.Event) => boolean;
	export interface StackLayoutModelOptions extends StackLayout.StackLayoutOptions {
		stackIndexAttributeName?: string;
		stackElementIndexAttributeName?: string;
	}
	export interface StackLayoutViewOptions extends mvc.ViewOptions<StackLayoutModel, SVGElement> {
		layoutOptions?: StackLayoutModelOptions;
		paper: dia.Paper;
		preview?: PreviewCallback;
		validateMoving?: ValidateMovingCallback;
		modifyInsertElementIndex?: ModifyInsertElementIndexCallback;
		insertElement?: InsertElementCallback;
		canInteract?: CanInteractCallback;
	}
	export interface StackLayoutModel extends mvc.Model<StackLayoutModelOptions> {
		update(): void;
		getStackFromPoint(point: g.PlainPoint): StackLayout.Stack;
		getInsertElementIndexFromPoint(stack: StackLayout.Stack, point: g.PlainPoint): number;
		getStackFromElement(element: dia.Element): StackLayout.Stack;
		hasElement(element: dia.Element): boolean;
		insertElement(element: dia.Element, targetStackIndex: number, insertElementIndex: number, opt?: dia.Cell.Options): void;
		bbox: g.Rect;
		elements: dia.Element[];
		stacks: StackLayout.Stack[];
		direction: StackLayout.Directions;
	}
}
declare namespace Stencil {
	type MatchCellCallback = (cell: dia.Cell, keyword: string, groupId: string, stencil: Stencil) => boolean;
	type MatchCellMap = {
		[type: string]: Array<dia.Path>;
	};
	type DropAnimation = boolean | {
		duration?: number | string;
		easing?: string;
	};
	type LayoutGroupCallback = (graph: dia.Graph, group: Group) => void;
	export interface Options extends mvc.ViewOptions<undefined> {
		paper: dia.Paper | PaperScroller;
		width?: number | string;
		height?: number | string;
		label?: string | HTMLElement;
		groups?: {
			[key: string]: Stencil.Group;
		};
		groupsToggleButtons?: boolean;
		dropAnimation?: DropAnimation;
		search?: MatchCellMap | MatchCellCallback | null;
		layout?: boolean | GridLayout.Options | {
			[key: string]: any;
		} | LayoutGroupCallback;
		snaplines?: Snaplines;
		scaleClones?: boolean;
		usePaperGrid?: boolean;
		dragStartClone?: (cell: dia.Cell) => dia.Cell;
		dragEndClone?: (cell: dia.Cell) => dia.Cell;
		dragThreshold?: number | "onpointerdown";
		paperOptions?: (() => dia.Paper.Options) | dia.Paper.Options;
		paperDragOptions?: (() => dia.Paper.Options) | dia.Paper.Options;
		canDrag?: (cellView: dia.CellView, evt: dia.Event, groupName: string | null) => boolean;
		contentOptions?: dia.Paper.FitToContentOptions;
		container?: mvc.$Element;
		cellCursor?: string;
		autoZIndex?: boolean;
	}
	export interface Group {
		label: string | HTMLElement;
		index: number;
		closed?: boolean;
		height?: number;
		layout?: boolean | GridLayout.Options | {
			[key: string]: any;
		};
		paperOptions?: (() => dia.Paper.Options) | dia.Paper.Options;
		[key: string]: any;
	}
}
declare namespace Swimlane {
	interface HeaderAttributes extends attributes.SVGRectAttributes {
		automaticHeaderAttributes?: boolean;
	}
	interface HeaderTextAttributes extends attributes.SVGTextAttributes {
		automaticHeaderTextAttributes?: boolean;
		automaticHeaderTextWrap?: boolean;
	}
	interface Selectors {
		root?: attributes.SVGAttributes;
		body?: attributes.SVGRectAttributes;
		header?: HeaderAttributes;
		headerText?: HeaderTextAttributes;
	}
	interface Attributes<T> extends dia.Element.GenericAttributes<T> {
		headerSide?: dia.OrthogonalDirection;
		headerSize?: number;
		headerTextMargin?: number;
		contentMargin?: number;
	}
}
declare namespace SwimlaneBoundary {
	export interface Options extends dia.ToolView.Options {
		laneId: string;
		padding?: dia.Sides;
		attributes?: attributes.NativeSVGAttributes;
	}
}
declare namespace SwimlaneTransform {
	export interface HandleOptions extends mvc.ViewOptions<undefined> {
		axis: "x" | "y";
		side: dia.OrthogonalDirection;
	}
	export class Handle extends mvc.View<undefined> {
		options: HandleOptions;
	}
	export interface Handle {
		new (...args: any[]): Handle;
	}
	export interface Options extends dia.ToolView.Options {
		laneId: string;
		minSize?: number;
		handleClass?: any;
		padding?: dia.Sides;
		stopPropagation?: boolean;
		constraintsPadding?: number;
		minSizeConstraints?: (model: Pool, laneId: string, handleSide: dia.OrthogonalDirection) => Array<dia.Point>;
		maxSizeConstraints?: (model: Pool, laneId: string, handleSide: dia.OrthogonalDirection) => Array<dia.Point>;
	}
}
declare namespace TextEditor {
	interface Annotation extends Vectorizer.TextAnnotation {
		[key: string]: any;
	}
	interface URLAnnotation extends Annotation {
		url: string;
	}
	type URLAnnotationCallback = (url: string) => Partial<URLAnnotation>;
	interface Options extends mvc.ViewOptions<undefined> {
		text?: string; // The SVG text element on which we want to enable inline text editing.
		newlineCharacterBBoxWidth?: number; // The width of the new line character. Used for selection of a newline.
		placeholder?: boolean | string; // The placeholder in case the text gets emptied.
		focus?: boolean; // Determines if the textarea should gain focus. In some cases, this is not intentional - e.g. if we use the ui.TextEditor for displaying remote cursor.
		debug?: boolean;
		useNativeSelection?: boolean;
		annotateUrls?: boolean;
		cellView?: dia.CellView;
		textProperty?: dia.Path;
		annotationsProperty?: dia.Path;
		urlAnnotation?: Partial<URLAnnotation> | URLAnnotationCallback;
		textareaAttributes?: {
			autocorrect?: string;
			autocomplete?: string;
			autocapitalize?: string;
			spellcheck?: string;
			tabindex?: string;
		};
		onKeydown?: (this: TextEditor, evt: KeyboardEvent, editor: TextEditor) => void;
		onOutsidePointerdown?: (this: TextEditor, evt: PointerEvent, editor: TextEditor) => void;
	}
	interface Selection {
		end: number | null;
		start: number | null;
	}
	interface EventMap {
		"open": (textElement: SVGElement, cellView: dia.CellView | null) => void;
		"close": (textElement: SVGElement, cellView: dia.CellView | null) => void;
		"text:change": (text: string, prevText: string, annotation: Array<Vectorizer.TextAnnotation>, selection: Selection, prevSelection: Selection) => void;
		"select:change": (selectionStart: number, selectionEnd: number) => void;
		"select:changed": (selectionStart: number, selectionEnd: number) => void;
		"select:out-of-range": (selectionStart: number, selectionEnd: number) => void;
		"caret:change": (caretPosition: number) => void;
	}
}
declare namespace Toolbar {
	export interface Options extends mvc.ViewOptions<undefined> {
		tools?: Array<{
			[key: string]: any;
		} | string>;
		groups?: {
			[key: string]: {
				index?: number;
				align?: Align;
			};
		};
		references?: any;
		autoToggle?: boolean;
		widgetNamespace?: {
			[name: string]: typeof Widget;
		};
	}
	enum Align {
		Left = "left",
		Right = "right"
	}
}
declare namespace Tooltip {
	export enum TooltipPosition {
		Left = "left",
		Top = "top",
		Bottom = "bottom",
		Right = "right"
	}
	enum TooltipArrowPosition {
		Left = "left",
		Top = "top",
		Bottom = "bottom",
		Right = "right",
		Auto = "auto",
		Off = "off"
	}
	interface Animation {
		duration?: number | string;
		delay?: number | string;
		timingFunction?: string;
		[key: string]: any;
	}
	export interface RenderOptions {
		target?: string | Element;
		x?: number;
		y?: number;
	}
	export interface Options extends mvc.ViewOptions<undefined> {
		position?: TooltipPosition | ((element: Element) => TooltipPosition);
		positionSelector?: string | ((element: Element) => Element);
		direction?: TooltipArrowPosition;
		minResizedWidth?: number;
		padding?: number;
		rootTarget?: mvc.$Element;
		target?: mvc.$Element;
		container?: mvc.$Element;
		trigger?: string;
		viewport?: {
			selector?: mvc.$Element;
			padding?: number;
		};
		dataAttributePrefix?: string;
		template?: string;
		content?: mvc.$Element | ((this: Tooltip, node: Node, tooltip: Tooltip) => mvc.$Element | false | null | undefined);
		animation?: boolean | Animation;
	}
}
declare namespace TreeLayout {
	interface AttributeNames {
		"siblingRank"?: string;
		"direction"?: string;
		"margin"?: string;
		"offset"?: string;
		"prevSiblingGap"?: string;
		"nextSiblingGap"?: string;
		"firstChildGap"?: string;
	}
	type Direction = "L" | "R" | "T" | "B" | "BR" | "BL" | "TR" | "TL";
	type FromToDirections = [
		Direction,
		Direction
	];
	type DirectionRule = (rule: FromToDirections) => (direction: Direction) => Direction;
	type SiblingRank = number | undefined;
	export interface DirectionRules {
		rotate: DirectionRule;
		flip: DirectionRule;
		straighten: DirectionRule;
	}
	interface UpdateOptions {
		[key: string]: any;
	}
	type UpdatePositionCallback = (element: dia.Element, position: dia.Point, opt: UpdateOptions, treeLayout: TreeLayout) => void;
	type UpdateVerticesCallback = (link: dia.Link, vertices: Array<dia.Point>, opt: UpdateOptions, treeLayout: TreeLayout) => void;
	type UpdateSiblingRankCallback = (element: dia.Element, siblingRank: SiblingRank, opt: UpdateOptions, treeLayout: TreeLayout) => void;
	type UpdateAttributesCallback = (layoutArea: LayoutArea, root: dia.Element, rootLink: dia.Link, opt: UpdateOptions, treeLayout: TreeLayout) => void;
	type FilterCallback = (children: dia.Element[], parent: dia.Element | null, opt: UpdateOptions, treeLayout: TreeLayout) => dia.Element[];
	export interface Options {
		graph: dia.Graph;
		gap?: number;
		parentGap?: number;
		siblingGap?: number;
		firstChildGap?: number;
		direction?: Direction;
		directionRule?: DirectionRule;
		updatePosition?: null | UpdatePositionCallback;
		updateVertices?: null | UpdateVerticesCallback;
		updateSiblingRank?: null | UpdateSiblingRankCallback;
		updateAttributes?: null | UpdateAttributesCallback;
		filter?: null | FilterCallback;
		attributeNames?: AttributeNames;
		symmetrical?: boolean;
	}
	interface ReconnectElementOptions {
		siblingRank?: TreeLayout.SiblingRank;
		direction?: TreeLayout.Direction;
		[key: string]: any;
	}
	class LayoutArea {
		root: dia.Element;
		link: dia.Link | null;
		level: number;
		/**
		 * Normalized sibling rank (0,1,2,3,..)
		 */
		siblingRank: SiblingRank;
		rootOffset: number;
		rootMargin: number;
		// Gaps
		siblingGap: number;
		parentGap: number;
		nextSiblingGap: number;
		prevSiblingGap: number;
		firstChildGap: number;
		// metrics
		x: number;
		y: number;
		dx: number;
		dy: number;
		width: number;
		height: number;
		rootCX: number;
		rootCY: number;
		// references
		parentArea: LayoutArea | null;
		childAreas: LayoutArea[];
		siblings: {
			[direction in Direction]: LayoutSiblings;
		};
	}
	class LayoutSiblings {
		direction: Direction;
		width: number;
		height: number;
		layoutAreas: LayoutArea[];
		parentArea: LayoutArea;
		siblingGap: number;
	}
}
declare namespace TreeLayoutView {
	interface ConnectionDetails {
		level: number;
		direction: TreeLayout.Direction;
		siblingRank: number;
		siblings: Array<dia.Element>;
	}
	export interface Options extends mvc.ViewOptions<TreeLayout> {
		previewAttrs?: {
			[key: string]: any;
		};
		useModelGeometry?: boolean;
		clone?: (element: dia.Element) => dia.Element;
		canInteract?: (elementView: dia.ElementView, evt: dia.Event) => boolean;
		validateConnection?: ((element: dia.Element, candidate: dia.Element, treeLayoutView: TreeLayoutView, details: ConnectionDetails) => boolean) | null;
		validatePosition?: ((element: dia.Element, x: number, y: number, treeLayoutView: TreeLayoutView) => boolean) | null;
		reconnectElements?: ((elements: dia.Element[], parent: dia.Element, siblingRank: number, direction: TreeLayout.Direction, treeLayoutView: TreeLayoutView) => void) | null;
		translateElements?: ((elements: dia.Element[], x: number, y: number, treeLayoutView: TreeLayoutView) => void) | null;
		layoutFunction?: ((treeLayoutView: TreeLayoutView) => void) | null;
		paperConstructor?: typeof dia.Paper;
		paperOptions?: dia.Paper.Options;
		[key: string]: any;
	}
}
declare namespace Validator {
	interface Options {
		commandManager: CommandManager;
		cancelInvalid?: boolean;
	}
	type Callback = (err: Error, command: any, next: any) => any;
}
declare namespace bpmn2 {
	export { borderType, borderStyle, IconSet, Metrics, IconsFlows, IconsOrigins, MarkersAttributes, BorderAttributes, IconAttributes, Activity, Pool, PoolView, HeaderedPool, HeaderedPoolView, Gateway, Conversation, ConversationLinkSelectors, ConversationLink, Annotation, AnnotationLinkSelectors, AnnotationLink, DataObject, DataAssociation, DataStore, Event_2 as Event, Flow, Group, Choreography, CompositePool, HeaderedCompositePool, CompositePoolView, HorizontalPool, HorizontalPoolView, HeaderedHorizontalPool, HeaderedHorizontalPoolView, VerticalPool, VerticalPoolView, HeaderedVerticalPool, HeaderedVerticalPoolView, Swimlane, SwimlaneView, HorizontalSwimlane, HorizontalSwimlaneView, VerticalSwimlane, VerticalSwimlaneView, Phase, PhaseView, HorizontalPhase, HorizontalPhaseView, VerticalPhase, VerticalPhaseView };
}
declare namespace chart {
	export { Plot, Matrix, Pie, Knob, PlotView, MatrixView, PieView, KnobView };
}
declare namespace gexf {
	export { toCellsArray, ElementOptions, LinkOptions };
}
declare namespace measurement {
	export { Distance, Angle };
}
declare namespace widgets {
	interface WidgetMap {
		button: button;
		checkbox: checkbox;
		"color-picker": colorPicker;
		fullscreen: fullscreen;
		"input-number": inputNumber;
		"input-text": inputText;
		label: label;
		range: range;
		redo: redo;
		"select-box": selectBox;
		"select-button-group": selectButtonGroup;
		separator: separator;
		textarea: textarea;
		toggle: toggle;
		undo: undo;
		"zoom-in": zoomIn;
		"zoom-out": zoomOut;
		"zoom-slider": zoomSlider;
		"zoom-to-fit": zoomToFit;
	}
	class button extends Widget {
	}
	class checkbox extends Widget {
	}
	class colorPicker extends Widget {
		setValue: (value: string, opt?: {
			silent: boolean;
		}) => void;
	}
	class fullscreen extends button {
	}
	class inputNumber extends Widget {
	}
	class inputText extends Widget {
	}
	class label extends Widget {
	}
	class range extends Widget {
		setValue: (value: number, opt?: {
			silent: boolean;
		}) => void;
	}
	class redo extends button {
	}
	class selectBox extends Widget {
		selectBox: SelectBox;
	}
	class selectButtonGroup extends Widget {
		selectButtonGroup: SelectButtonGroup;
	}
	class separator extends Widget {
	}
	class textarea extends Widget {
	}
	class toggle extends Widget {
	}
	class undo extends button {
	}
	class zoomIn extends button {
	}
	class zoomOut extends button {
	}
	class zoomSlider extends range {
	}
	class zoomToFit extends button {
	}
}
declare type IconSet = Record<string, string>;
declare type Metrics = any;
declare type borderStyle = "solid" | "dashed" | "dotted";
declare type borderType = "single" | "double" | "thick";
declare module "@joint/core" {
export const versionPlus: string;
export namespace graphUtils {
	export { constructTree, shortestPath, toAdjacencyList, ConstructTreeNode, ConstructTreeConfig, ShortestPathOptions, AdjacencyList };
}
export namespace storage {
	export { Local };
}
export namespace alg {
	export { Dijkstra, PriorityQueue, PriorityQueueOptions };
}
export namespace dia {
	export { SearchGraph, CommandManager, Validator };
}
export namespace elementTools {
	export { RecordScrollbar, SwimlaneBoundary, SwimlaneTransform };
}
export namespace format {
	export { PrintAction, PrintUnits, PrintExportOptions, print, BeforeSerialize, SVGExportOptions, toSVG, openAsSVG, CanvasExportOptions, RasterExportOptions, toPNG, toDataURL, toJPEG, toCanvas, openAsPNG, gexf };
}
export namespace layout {
	export { ForceDirected, GridLayout, StackLayout, TreeLayout };
}
export namespace shapes {
	export namespace standard {
		export { Record$1 as Record, HeaderedRecord, BorderedRecord, RecordView, HeaderedRecordView, BorderedRecordView };
	}
	export { bpmn2, chart, measurement };
}
export namespace ui {
	export { BPMNFreeTransform, Clipboard, ColorPalette, ContextToolbar, Dialog, FlashMessage, FreeTransform, Halo, Inspector, Keyboard, Lightbox, Navigator, PaperScroller, PathDrawer, PathEditor, Popup, RadioGroup, SelectBox, SelectButtonGroup, Selection, SelectionFrameList, OverlaySelectionFrameList, HighlighterSelectionFrameList, SVGSelectionFrameList, HTMLSelectionFrameList, SelectionWrapper, HTMLSelectionWrapper, SelectionRegion, RectangularSelectionRegion, PolygonalSelectionRegion, RangeSelectionRegion, Snaplines, StackLayoutView, Stencil, TextEditor, Toolbar, Tooltip, TreeLayoutView, Widget, widgets };
}
}
interface CanvasExportOptions extends SVGExportOptions {
	height?: number;
	width?: number;
	size?: string;
	backgroundColor?: string;
	padding?: dia.Padding;
	canvg?: any;
}
interface PrintExportOptions {
	sheet?: dia.Size;
	sheetUnit?: PrintUnits;
	area?: g.Rect;
	ready?: (pages: HTMLDivElement[], printAction: PrintAction, opt: {
		sheetSizePx: dia.Size & {
			cssWidth: string;
			cssHeight: string;
		};
	}) => void;
	poster?: boolean | {
		rows: number;
		columns: number;
	} | dia.Size;
	margin?: dia.Padding;
	marginUnit?: PrintUnits;
	padding?: dia.Padding;
	grid?: boolean;
}
interface PriorityQueueOptions {
	comparator?: (a: number, b: number) => number;
	data: Array<any>;
}
interface QuadtreeObject {
	id: string;
	p: dia.Point;
	weight: number;
	radius?: number;
}
interface RasterExportOptions extends CanvasExportOptions {
	type?: "image/png" | "image/jpeg" | string;
	quality?: number;
}
interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}
interface SVGExportOptions {
	preserveDimensions?: boolean;
	area?: dia.BBox;
	convertImagesToDataUris?: boolean;
	useComputedStyles?: boolean;
	stylesheet?: string;
	grid?: boolean;
	beforeSerialize?: BeforeSerialize;
	fillFormControls?: boolean;
}
type BeforeSerialize = (doc: SVGSVGElement, paper: dia.Paper) => void | SVGElement;
type PrintAction = (pages: HTMLDivElement[] | false) => void;
type PrintUnits = "mm" | "cm" | "in" | "pt" | "pc";


