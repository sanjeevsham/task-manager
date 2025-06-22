// import { Injectable, InjectionToken, Injector, TemplateRef } from '@angular/core';
// import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
// import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
// import { filter } from 'rxjs/operators';
// import { fromEvent, Subscription } from 'rxjs';
// import { cspfmObservableListenerUtils } from './cspfmObservableListenerUtils';
// import * as uuid from 'uuid';
// import { appConfiguration } from '../utils/appConfiguration';

// // using external non-typed js libraries
// declare const window: any;
// declare const $: any;
// interface overlayPopoverConfig {
//   hasBackdrop?; // To enable a backdrop when popup is opened
//   isBackdropClose?; // to close the popUp in outside click(anywhere in the window)
//   backdropClass?; // to add a class in the cdk-overlay backdrop
//   positionType?; // Position type can be either "dropdown" or "balloon"
//   positionOffset?: { top?: number, right?: number, bottom?: number, left?: number }; // to determine the top , right , bottom , left values.
//   panelClass?; // to add a class in the overlay pane
//   disposeOnNavigation?; // to close the Popup on navigation
//   appendTo?; // to append the popup content in required element
//   defaultPosition?:{top?:Boolean,right?:Boolean,bottom?:Boolean,left?:Boolean,center?:Boolean}; // default Position can be either "rightToLeft" or "leftToRight"
//   needPopupFromEndToEnd?: { // to position the popUp either from start of the clicked element or end of the clicked element.
//     horizontal?: boolean
//     vertical?: boolean
//   }
// }
// interface position {
//   top;
//   left
// }
// export const CONTAINER_DATA = new InjectionToken<{}>('CONTAINER_DATA');
// @Injectable({
//   providedIn: 'root',
// })
// export class cdkOverlayUtils {
//   private resizeObserver;
//   private backdropClickHandlers: (() => void)[] = [];
//   private backdropSubscription: Subscription;
//   private keysSubscription: Subscription;
//   private resizeSubscription$: Subscription

//   public overlayInstance: {
//     [currentInstanceId : string]:any
//   } = {};
//   public currentInstanceId;
//   private overlayIdStack = []

//   constructor(private overlay: Overlay, private injector: Injector,public observableListenerUtils:cspfmObservableListenerUtils,public appConfigurationObject:appConfiguration) {
//     this.resizeSubscription$ = fromEvent(window, 'resize').subscribe(evt => {
//       if (this.overlayInstance[this.currentInstanceId]?.popupPositionEvent && this.overlayInstance[this.currentInstanceId]?.configPositionType === 'balloon' || this.overlayInstance[this.currentInstanceId]?.configPositionType === 'balloonLikePopup') {
//         this.balloonLikePosition(this.overlayInstance[this.currentInstanceId].popupPositionEvent)
//       } else if (this.overlayInstance[this.currentInstanceId]?.popupPositionEvent && this.overlayInstance[this.currentInstanceId]?.configPositionType === 'dropdown') {
//         this.dropdownLikePosition(this.overlayInstance[this.currentInstanceId].popupPositionEvent)
//       } else {
//         this.overlayInstance[this.currentInstanceId]?.popupPositionEvent && this.dropdownLikePosition(this.overlayInstance[this.currentInstanceId]?.popupPositionEvent);
//       }

//     })
//   }

//   public openFloatingPanel(component, event, data, config: overlayPopoverConfig) {
//     const overlayConfig = new OverlayConfig({
//       // positionStrategy: this.getPositionStrategy(event),
//       scrollStrategy: this.overlay.scrollStrategies.close(),
//     });
//     if (config?.backdropClass) {
//       overlayConfig.backdropClass = config?.backdropClass
//     } else {
//       overlayConfig.backdropClass = "cdk-overlay-transparent-backdrop"
//     }
//     overlayConfig.hasBackdrop = config?.hasBackdrop ? config?.hasBackdrop : false;
//     overlayConfig.panelClass = config?.panelClass ? config?.panelClass : '';

//     const overlayRef = this.overlay.create(overlayConfig);
//     const popupComponentPortal = new ComponentPortal(component);            
//     const componentRef = overlayRef.attach(popupComponentPortal);
//     const receivingComponent = componentRef.location.nativeElement;
//     data.overlayRef = overlayRef;
//     data.componentRef = componentRef;
//     this.currentInstanceId = uuid.v4();
//     this.overlayInstance[this.currentInstanceId] = new OverlayClass(event, overlayRef, config,componentRef,receivingComponent);
//     this.overlayIdStack.push(this.currentInstanceId)
//     this.overlayInstance[this.currentInstanceId]?.backdropClickHandlers?.push(data.backdropClickHandler);
//     if (data['type'] && data['type'] === 'UserView') {
//       this.overlayInstance[this.currentInstanceId].userViewBackgroundOverlayRef = overlayRef;
//     }
//     if (config?.isBackdropClose) {
//       this.subscribeToCloseEvents();
//     }
//     if(config?.appendTo){
//       config['appendTo'].appendChild(overlayRef.overlayElement);
//     }
//     this.overlayInstance[this.currentInstanceId].configPositionType = config?.positionType ? config?.positionType : '';
//     if (this.overlayInstance[this.currentInstanceId]?.configPositionType === 'balloon') {
//       Object.assign(componentRef.instance, { balloonLayoutInfoFromView: data });
//       this.balloonLikePosition(event);
//     } else if (this.overlayInstance[this.currentInstanceId]?.configPositionType === 'dropdown') {
//       Object.assign(componentRef.instance, data);
//       this.dropdownLikePosition(event);
//     } else if (this.overlayInstance[this.currentInstanceId]?.configPositionType === 'balloonLikePopup') {
//       Object.assign(componentRef.instance, data);
//       this.balloonLikePosition(event);
//     } else {
//       Object.assign(componentRef.instance, data);
//       this.dropdownLikePosition(event);
//     }
//   };

//   public openFloatingPanelWithTemplateRef(templateRef: TemplateRef<any>, event, data, config: overlayPopoverConfig, viewContainerRef) {
//     if((templateRef['_declarationTContainer']['localNames'][0]==='rollupPopover' || templateRef['_declarationTContainer']['localNames'][0] ==='formulatemplate') && !this.appConfigurationObject['configuration']['isExpressionRequiredToShow']){
//       return 
//     }
//     const overlayConfig = new OverlayConfig({
//       //  positionStrategy: this.getOverlayPosition(event),
//       scrollStrategy: this.overlay.scrollStrategies.close(),
//     });
//     if (config?.backdropClass) {
//       overlayConfig.backdropClass = config['backdropClass'];
//     } else {
//       overlayConfig.backdropClass = "cdk-overlay-transparent-backdrop"
//     }
//     overlayConfig.hasBackdrop = config?.hasBackdrop ? config?.hasBackdrop : false;
//     overlayConfig.panelClass = config?.panelClass ??  '';
//     const templateRefOverlay = this.overlay.create(overlayConfig);
//     const popupComponentPortal = new TemplatePortal(templateRef, viewContainerRef, { data: data });;
//     let componentRef = templateRefOverlay.attach(popupComponentPortal);
//     let receivingComponent = componentRef.rootNodes[0];
//     this.currentInstanceId = uuid.v4();
//     this.overlayInstance[this.currentInstanceId] = new OverlayClass(event, templateRefOverlay, config,componentRef,receivingComponent);
//     this.overlayInstance[this.currentInstanceId]?.backdropClickHandlers?.push(data.backdropClickHandler);
//     this.overlayIdStack.push(this.currentInstanceId)
//     data.overlayRef = templateRefOverlay;
//     if (config?.isBackdropClose) {
//       this.subscribeToCloseEvents();
//     }
//     this.overlayInstance[this.currentInstanceId].configPositionType = config?.positionType ? config?.positionType : '';
//     if(this.overlayInstance[this.currentInstanceId]?.configPositionType === 'balloon') {
//       this.balloonLikePosition(event)
//     } else if (this.overlayInstance[this.currentInstanceId]?.configPositionType === 'balloonLikePopup') {
//       this.balloonLikePosition(event)
//     } else if(this.overlayInstance[this.currentInstanceId]?.configPositionType === 'dropdown'){
//       this.dropdownLikePosition(event);
//     } else{
//       this.dropdownLikePosition(event);
//     }
//   };
//   //   createInjector(dataToPass) : Injector {
//   //     const injectorTokens = new WeakMap();
//   //     injectorTokens.set(CONTAINER_DATA, dataToPass);
//   //     const injector =  Injector.create({
//   //       // parent: this.injector,
//   //       providers: [
//   //         { provide: 'initialValue', useValue: dataToPass }
//   //       ]
//   //     })
//   //     // expect(injector.get(Injector)).toBe(injector);
//   //     return injector;
//   //     // return new PortalInjector(this.injector, injectorTokens);
//   // }
//   //  public getPositionStrategy(event) {
//   //    let position = this.userViewDropdownLikePosition(event);
//   //    console.log('position', position)
//   //    return this.overlay
//   //      .position()
//   //      .global()
//   //      .left(`${position?.left}px`)
//   //      .top(`${position?.top}px`);
//   //  }
//   public closeFloatingPanel() {
//     if(this.overlayInstance[this.currentInstanceId]){
//     const overlayRef = this.overlayInstance[this.currentInstanceId].overlayRef;
//     if (!overlayRef) {
//       if (!this.overlayInstance[this.currentInstanceId]?.userViewBackgroundOverlayRef) {
//         return
//       }
//       this.overlayInstance[this.currentInstanceId].userViewBackgroundOverlayRef?.detach();
//       this.overlayInstance[this.currentInstanceId].userViewBackgroundOverlayRef = null;
//       this.clearSubscriptions();
//     }
//     if(this.overlayInstance[this.currentInstanceId].componentRef?.instance?.balloonComponenetInstance && this.overlayInstance[this.currentInstanceId].componentRef?.instance?.subscriberId){
//       this.observableListenerUtils.unsubscribe('balloonActionsFromBalloonLayouts',this.overlayInstance[this.currentInstanceId].componentRef.instance.subscriberId);
//     }
//     overlayRef?.detach();
//     overlayRef?.dispose();
//     this.clearSubscriptions();
//     this.removeOverlayById(this.currentInstanceId)
//   }
//   }

//   public removeOverlayById(currentInstanceIdToRemove: string): void {
//     if (this.overlayInstance.hasOwnProperty(currentInstanceIdToRemove)) {
//       delete this.overlayInstance[currentInstanceIdToRemove];
//       this.overlayIdStack.pop();
//       if (this.overlayIdStack.length > 0) {
//         this.currentInstanceId = this.overlayIdStack[this.overlayIdStack.length - 1];
//       } else {
//         this.currentInstanceId = null;
//       }
//     }else {
//       this.currentInstanceId = null;
//     }
//   }

//   private subscribeToCloseEvents() {
//     this.keysSubscription = this.overlayInstance[this.currentInstanceId]?.overlayRef
//       .keydownEvents()
//       .pipe(filter((event: KeyboardEvent) => event.code === 'Escape'))
//       .subscribe(() => {
//         console.log('key pressed');
//         const backdropClickHandler = this.overlayInstance[this.currentInstanceId].backdropClickHandlers.pop();
//         if (backdropClickHandler) {
//           backdropClickHandler();// Call the backdrop click handler if defined
//         }
//         this.closeFloatingPanel();
//       });

//     this.backdropSubscription = this.overlayInstance[this.currentInstanceId]?.overlayRef
//       .backdropClick()
//       .subscribe(() => {
//         console.log('backdrop pressed');
//         const backdropClickHandler = this.overlayInstance[this.currentInstanceId].backdropClickHandlers;
//         backdropClickHandler.forEach(handler => {
//           if(handler) {
//             handler();// Call the backdrop click handler if defined
//         }
//         });
//         this.closeFloatingPanel();
//       });
//   }
//   private clearSubscriptions(): void {
//     if (this.backdropSubscription) {
//       this.backdropSubscription.unsubscribe();
//     }

//     if (this.keysSubscription) {
//       this.keysSubscription.unsubscribe();
//     }

//     if (this.resizeSubscription$) {
//       this.resizeSubscription$.unsubscribe();
//     }
//     if (this.overlayInstance[this.currentInstanceId]?.popupSize) {
//       this.resizeObserver.unobserve(this.overlayInstance[this.currentInstanceId].popupSize);
//     }
//   }

//   private dropdownLikePosition(event) {

//     let openedPopupComponent = this.overlayInstance[this.currentInstanceId].receivingComponent;
//     let defaultPopupPosition = this.overlayInstance[this.currentInstanceId].defaultPosition;
//     this.overlayInstance[this.currentInstanceId].popupPositionEvent = event;
//     let currentEventTarget = this.overlayInstance[this.currentInstanceId].popupPositionEvent['target'];
//     const windowHeight = window.innerHeight;
//     let clickedPosition, clickedBtnWidth, clickedBtnHeight;
//     if (currentEventTarget.classList.contains('clickedBtnWidth')) {
//       clickedPosition = currentEventTarget.getBoundingClientRect();
//       clickedBtnWidth = currentEventTarget.offsetWidth;
//       clickedBtnHeight = currentEventTarget.offsetWidth;
//     } else {
//       clickedPosition = currentEventTarget.closest(".clickedBtnWidth").getBoundingClientRect();
//       clickedBtnWidth = currentEventTarget.closest(".clickedBtnWidth").offsetWidth;
//       clickedBtnHeight = currentEventTarget.closest(".clickedBtnWidth").offsetHeight;
//     }
//     let xPosition = clickedPosition.left;
//     let yPosition = clickedPosition.top;
//     var openedPopupWidth = openedPopupComponent.offsetWidth;
//     let openedPopupHeight = openedPopupComponent.offsetHeight;

//     let position = {
//       top: undefined,
//       left: undefined
//     };
//     let positionClass: string[] = [];
//     let positionOffset = this.overlayInstance[this.currentInstanceId]?.positionOffset;
//     let needPopupFromEndToEnd =  this.overlayInstance[this.currentInstanceId]?.needPopupFromEndToEnd;
//     // choose left are right
//     if(defaultPopupPosition?.left === true){
//       position['left'] = Math.floor(xPosition - openedPopupWidth + clickedBtnWidth);
//       if(openedPopupWidth > 0){
//         positionClass.push('cs-positionLeft');
//       }
//     }
//     else if (defaultPopupPosition?.right === true){
//       position['left'] = Math.floor(xPosition);
//       if(openedPopupWidth > 0){
//         positionClass.push('cs-positionRight');
//       }
//     }
//     else{
//       if ((window.innerWidth - xPosition) - (openedPopupWidth + clickedBtnWidth) > 0) {
//         position['left'] = Math.floor(xPosition) - 
//         + (positionOffset?.right ? positionOffset?.right : 0);
//         if(openedPopupWidth > 0){
//           positionClass.push('cs-positionRight');
//         }
//       } else {
//         position['left'] = Math.floor(xPosition - openedPopupWidth) + (needPopupFromEndToEnd?.horizontal ? clickedBtnWidth : 0 ) + (positionOffset?.left ? positionOffset?.left : 0);
//         if(openedPopupWidth > 0){
//           positionClass.push('cs-positionLeft');
//         }
//         if(position['left'] <= 0){
//           position['left'] = 20;//if balloon left is in minus(-) just set the position as 20
//         }
//       }
//     }
//     // choose top or bottom or center
//     if(defaultPopupPosition?.bottom === true){
//       position['top'] = Math.floor(yPosition + clickedBtnHeight);
//       if(openedPopupHeight > 0){
//         positionClass.push('cs-positionBottom')
//       }
//     }else if(defaultPopupPosition?.top === true){
//       position['top'] = Math.floor((yPosition - openedPopupHeight));
//       if(openedPopupHeight > 0){
//         positionClass.push('cs-positionTop')
//       }
//     }else if(defaultPopupPosition?.center === true){
//         position['top'] = Math.floor((yPosition - 25) - ((yPosition + openedPopupHeight) - windowHeight));
//         positionClass.push('cs-positionCenter')
//     }else{
//       if (windowHeight - (yPosition + openedPopupHeight + clickedBtnHeight) > 0) {
//         position['top'] = Math.floor(yPosition + clickedBtnHeight) + (positionOffset?.top ? positionOffset?.top : 0);
//           if(openedPopupHeight > 0){
//             positionClass.push('cs-positionBottom')
//           }
//         }
//         else {
//           if (((yPosition) > openedPopupHeight)) {
//             // find hidden area of popup height and add with ct
//           position['top'] = Math.floor((yPosition - openedPopupHeight)) + (positionOffset?.top ? positionOffset?.top : 0);
//             if(openedPopupHeight > 0){
//               positionClass.push('cs-positionTop')
//           }
//           }
//           else {
//             position['top'] = Math.floor((yPosition - 25) - ((yPosition + openedPopupHeight) - windowHeight));
//             positionClass.push('cs-positionCenter')
//         }
//       }
//     }
//     // height set to unset -> to make content based height for balloon popup
//     this.resizeObserver = new ResizeObserver(entries => {
//       for (const entry of entries) {
//         // Check for width change
//         if ((this.overlayInstance[this.currentInstanceId]?.popupLastHeight !== entry.target['offsetHeight'] && entry.target['offsetHeight'] !== 0) || (this.overlayInstance[this.currentInstanceId]?.popupLastWidth !== entry.target['offsetWidth']) && entry.target['offsetWidth'] !== 0) {
//           this.dropdownLikePosition(this.overlayInstance[this.currentInstanceId].popupPositionEvent);
//           this.resizeObserver.unobserve(this.overlayInstance[this.currentInstanceId].popupSize);
//         }
//       }
//     });
//     // Select the element to observe
//     this.overlayInstance[this.currentInstanceId].popupSize = $(openedPopupComponent)[0] || undefined;
//     this.overlayInstance[this.currentInstanceId].popupLastHeight = this.overlayInstance[this.currentInstanceId].popupSize?.['offsetHeight'];
//     this.overlayInstance[this.currentInstanceId].popupLastWidth = this.overlayInstance[this.currentInstanceId].popupSize?.['offsetWidth'];
//     // Start observing the element
//     if (this.overlayInstance[this.currentInstanceId]?.popupSize) {
//       this.resizeObserver.observe(this.overlayInstance[this.currentInstanceId].popupSize);
//     }
//     $(this.overlayInstance[this.currentInstanceId].overlayRef?.['_pane']).css({ left: position.left, top: position.top });
//     if(positionClass.length > 0){
//     this.overlayInstance[this.currentInstanceId].overlayRef?.['_pane'].firstChild.classList.add(...positionClass)
//     }
//   }


//   public balloonLikePosition(event) {
//     let openedPopupComponent = this.overlayInstance[this.currentInstanceId].receivingComponent;
//     this.overlayInstance[this.currentInstanceId].popupPositionEvent = event;
//     let currentEventTarget = this.overlayInstance[this.currentInstanceId].popupPositionEvent['target'];
//     let ballBtnWidth = $(currentEventTarget).width();
//     if(this.overlayInstance[this.currentInstanceId]?.popupPositionEvent.timeStamp !== '' && this.overlayInstance[this.currentInstanceId]?.popupPositionEvent.timeStamp !== null && this.overlayInstance[this.currentInstanceId]?.popupPositionEvent.timeStamp !== this.overlayInstance[this.currentInstanceId].balloonTimeStampValue) {
//       this.overlayInstance[this.currentInstanceId].balloonTimeStampValue = this.overlayInstance[this.currentInstanceId].popupPositionEvent.timeStamp;
//       this.overlayInstance[this.currentInstanceId].balloonClickedPosition = JSON.parse(JSON.stringify(currentEventTarget.getBoundingClientRect()));
//     }
//     var ballPopupWidth = $(openedPopupComponent).width();
//     let ballPopupHeight = $(openedPopupComponent).height();
//     const windowHeight = window.innerHeight;
//     let position: position = {
//       top: undefined,
//       left: undefined
//     };
//     $(openedPopupComponent).fadeIn(500);
//     // choose left are right
//     let positionOffset = this.overlayInstance[this.currentInstanceId]?.positionOffset;
//     if ((window.innerWidth - this.overlayInstance[this.currentInstanceId].balloonClickedPosition['right']) - (ballPopupWidth + ballBtnWidth) > 0) {
//       position['left'] = Math.floor(this.overlayInstance[this.currentInstanceId].balloonClickedPosition['right'] +  (positionOffset?.right ? positionOffset?.right : 25));
//       if(position['left'] <= 0){
//         position['left'] = 20;//if balloon left is in minus(-) just set the position as 20
//       }
//     } else {
//       position['left'] = Math.floor(this.overlayInstance[this.currentInstanceId].balloonClickedPosition['left'] - ballPopupWidth - (positionOffset?.left ? positionOffset?.left : 30));
//       if(position['left'] <= 0){
//         position['left'] = 20;//if balloon left is in minus(-) just set the position as 20
//       }
//     }
//     // choose top or bottom or center

//     if (windowHeight - (this.overlayInstance[this.currentInstanceId].balloonClickedPosition['top'] + ballPopupHeight) < 0) {
//       position['top'] = Math.floor(windowHeight - ballPopupHeight - (positionOffset?.top ? positionOffset?.top : 25));
//     } else {
//       position['top'] = Math.floor(this.overlayInstance[this.currentInstanceId].balloonClickedPosition['top'] - (positionOffset?.top ? positionOffset?.top : 10));
//     }

//     $(openedPopupComponent).fadeIn("slow", "linear")
//     this.resizeObserver = new ResizeObserver(entries => {
//       for (const entry of entries) {
//         // Check for width change
//         console.log(this.overlayInstance[this.currentInstanceId]?.popupLastHeight, entry.target['offsetHeight'])
//         if ((this.overlayInstance[this.currentInstanceId]?.popupLastHeight !== entry.target['offsetHeight'] && entry.target['offsetHeight'] !== 0) || (this.overlayInstance[this.currentInstanceId]?.popupLastWidth !== entry.target['offsetWidth']) && entry.target['offsetWidth'] !== 0) {
//           this.balloonLikePosition(this.overlayInstance[this.currentInstanceId].popupPositionEvent);
//           this.resizeObserver.unobserve(this.overlayInstance[this.currentInstanceId].popupSize);
//         }
//       }
//     });
//     // Select the element to observe
//     this.overlayInstance[this.currentInstanceId].popupSize = $(openedPopupComponent)[0] || undefined;
//     this.overlayInstance[this.currentInstanceId].popupLastHeight = this.overlayInstance[this.currentInstanceId].popupSize?.['offsetHeight'];
//     this.overlayInstance[this.currentInstanceId].popupLastWidth = this.overlayInstance[this.currentInstanceId].popupSize?.['offsetWidth'];
//     // Start observing the element
//     if (this.overlayInstance[this.currentInstanceId].popupSize) {
//       this.resizeObserver.observe(this.overlayInstance[this.currentInstanceId].popupSize);
//     }
//     $(this.overlayInstance[this.currentInstanceId].overlayRef?.['_pane']).css({ left: position.left, top: position.top });
//   }
//   public ngOnDestroy() {
//     this.closeFloatingPanel();
//   }

// }

// class OverlayClass {
//   private popupPositionEvent: any;
//   private overlayRef: any;
//   private configPositionType: any;
//   private componentRef: any;
//   private receivingComponent: any;
//   private userViewBackgroundOverlayRef: any;
//   private popupSize: any;
//   private popupLastWidth: any;
//   private popupLastHeight: any;
//   private balloonClickedPosition:any;
//   private balloonTimeStampValue: any;
//   private defaultPosition: any;
//   private positionOffset: any;
//   private needPopupFromEndToEnd:any;
//   private backdropClickHandlers: (() => void)[] = [];

//   constructor(popupPositionEvent,overlayRef, config,componentRef,receivingComponent,popupSize?,popupLastWidth?,popupLastHeight?,balloonClickedPosition?,balloonTimeStampValue?,userViewBackgroundOverlayRef?) {
//     this.popupPositionEvent = popupPositionEvent
//     this.overlayRef = overlayRef
//     this.configPositionType = config?.configPositionType
//     this.positionOffset = config?.positionOffset
//     this.componentRef = componentRef
//     this.receivingComponent = receivingComponent
//     this.userViewBackgroundOverlayRef = userViewBackgroundOverlayRef
//     this.popupSize = popupSize
//     this.popupLastWidth = popupLastWidth
//     this.popupLastHeight = popupLastHeight
//     this.balloonClickedPosition = balloonClickedPosition
//     this.balloonTimeStampValue = balloonTimeStampValue
//     this.defaultPosition = config?.defaultPosition
//     this.needPopupFromEndToEnd = config?.needPopupFromEndToEnd
//     this.backdropClickHandlers = this.backdropClickHandlers
//   }
// }