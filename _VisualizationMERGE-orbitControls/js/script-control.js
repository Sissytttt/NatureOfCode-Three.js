// map GUI values to detailed parameters

// ======================= WATER =========================
function water_interaction_controller() {
    // weight
    water_params.BendMagnitude = map(control.Weight, 0, 10, 10, 200);
    water_params.Brightness = map(control.Weight, 0, 10, 0.01, 2);
    water_params.Brightness2 = map(control.Weight, 0, 10, 1, 5);
    // time
    if (control.Time <= 5) {
        water_params.MoveSpd = map(control.Time, 0, 5, 0.0001, 0.02);
        water_params.sideForce = map(control.Time, 0, 5, 0.5, 1);
    }
    else {
        water_params.MoveSpd = map(control.Time, 5, 10, 0.02, 0.1);
        water_params.sideForce = map(control.Time, 0, 5, 1, 2);
    }

    // Space
    if (water_update_lineNum) {
        water_params.Line_Num = map(water_space_int, 0, 10 / 3, 10, 40);
        water_setup_lines();
        water_update_lineNum = false;
    }
    if (control.Space <= 4) {
        water_params.ChangeSpeed = map(control.Space, 0, 4, 0.01, 0.03);
    }
    else {
        water_params.ChangeSpeed = map(control.Space, 4, 10, 0.002, 0.01);
    }
    // flow
    if (control.Flow <= 5) {
        water_params.lifeReductionMin = map(control.Flow, 0, 5, 0.004, 0.006);
        water_params.lifeReductionMax = map(control.Flow, 0, 5, 0.01, 0.02);
    }
    else {
        water_params.lifeReductionMin = map(control.Flow, 5, 10, 0.006, 0.01);
        water_params.lifeReductionMax = map(control.Flow, 5, 10, 0.02, 0.05);
    }
}


function water_update_space_int() {
    let calc_space_int = floor(control.Space / 3);
    water_space_int_prev = water_space_int;
    if (calc_space_int != water_space_int) {
        water_space_int = calc_space_int;
    }
    if (water_space_int_prev != water_space_int) {
        update_lineNum = true;
    }
    else {
        update_lineNum = false;
    }
}



// ======================= MOUNTAIN =========================
function mountain_interaction_controller() {
    // weight
    if (control.Weight < 4) {
        mountain_params.fade = false;
    }
    else if (control.Weight >= 7) {
        mountain_params.fade = true;
        mountain_params.lifeReductionMin = map(control.Weight, 10, 7, 0.001, 0.0008);
        mountain_params.lifeReductionMax = map(control.Weight, 10, 7, 0.005, 0.003);
    }
    else {
        mountain_params.fade = true;
        mountain_params.lifeReductionMin = map(control.Weight, 7, 4, 0.0005, 0.0005);
        mountain_params.lifeReductionMax = map(control.Weight, 7, 4, 0.01, 0.005);
    }

    // time
    // p.apply_outsideForce(mountain_params.outsideForce_strength);
    mountain_params.velocity = map(control.Time, 0, 10, 1, 10);

    // Space
    if (control.Space < 5) {
        mountain_params.WORLD_WIDTH = map(control.Space, 0, 5, 600, 1600);
    }
    else {
        mountain_params.WORLD_WIDTH = 1600;
    }
    // flow 
    // effect really not obvious *** because patterns are already formed.
    // flow value is small -- movement is fluent -- pattern is not obvious
    // if (control.Space <= 5) {
    //   mountain_params.rangeThreshold1 = map(control.Flow, 0, 5, 0.25, 0.2);
    //   mountain_params.rangeThreshold2 = map(control.Flow, 0, 5, 0.5, 0.5);
    //   mountain_params.rangeThreshold3 = map(control.Flow, 0, 5, 0.75, 0.8);
    // }
    // else {
    //   mountain_params.rangeThreshold1 = map(control.Flow, 5, 10, 0.2, 0.1);
    //   mountain_params.rangeThreshold2 = map(control.Flow, 5, 10, 0.5, 0.2);
    //   mountain_params.rangeThreshold3 = map(control.Flow, 5, 10, 0.8, 0.2);
    // }
}


// ======================== EARTH ==========================
function earth_interaction_controller() {
    // weight
    if (control.Weight <= 5) {
        earth_params.moveRangeMin = map(control.Weight, 0, 5, 50, 100);
        earth_params.moveRangeMax = map(control.Weight, 0, 5, 200, 400);
        earth_params.moveThreshold = map(control.Weight, 0, 5, 0.6, 0.5); // need test
    }
    else {
        earth_params.moveRangeMin = map(control.Weight, 5, 10, 300, 900);
        earth_params.moveRangeMax = map(control.Weight, 5, 10, 500, 2000);
        earth_params.moveThreshold = map(control.Weight, 5, 10, 0.5, 0.3);
    }

    // time // 变换不连贯
    if (control.Time <= 5) {
        earth_params.WaveFrameFreq = map(control.Time, 0, 5, 0.001, 0.003);
        earth_params.WaveRadFreq = map(control.Time, 0, 5, 0.0001, 0.005);
    }
    else {
        earth_params.WaveFrameFreq = map(control.Time, 5, 10, 0.003, 0.02);
        earth_params.WaveRadFreq = map(control.Time, 5, 10, 0.005, 0.01);
    }

    // Space
    if (control.Space <= 5) {
        earth_params.breathAmplMin = map(control.Space, 0, 5, 10, 25);
        earth_params.breathAmplMax = map(control.Space, 0, 5, 50, 100);
    }
    else {
        earth_params.breathAmplMin = map(control.Space, 5, 10, 25, 40);
        earth_params.breathAmplMax = map(control.Space, 5, 10, 100, 500);
    }

    // flow
    if (control.Flow <= 5) {
        earth_params.breathFreq = map(control.Flow, 0, 5, 0.005, 0.01);
        earth_params.lifeReductionMin = map(control.Flow, 0, 5, 0.004, 0.006);
        earth_params.lifeReductionMax = map(control.Flow, 0, 5, 0.01, 0.02);
    }
    else {
        earth_params.breathFreq = map(control.Flow, 5, 10, 0.01, 0.05);
        earth_params.lifeReductionMin = map(control.Flow, 5, 10, 0.006, 0.01);
        earth_params.lifeReductionMax = map(control.Flow, 5, 10, 0.02, 0.05);
    }
}


// ======================= THUNDER =========================
function thunder_interaction_controller() {
    // weight
    if (control.Weight <= 5) {
        thunder_params.branchPossibility = map(control.Weight, 0, 5, 0.004, 0.0055);
        thunder_params.moveSpdMin = map(control.Weight, 0, 5, 0.1, 1);
        thunder_params.moveSpdMax = map(control.Weight, 0, 5, 0.3, 2);
    }
    else {
        thunder_params.branchPossibility = map(control.Weight, 5, 10, 0.0055, 0.015);
        thunder_params.moveSpdMin = map(control.Weight, 5, 10, 1, 5);
        thunder_params.moveSpdMax = map(control.Weight, 5, 10, 2, 7);
    }
    thunder_params.thickness = floor(map(control.Weight, 0, 10, 1, 10)) * noise(frame * 0.05);

    // time 
    if (control.Time <= 5) {
        thunder_params.flowSpd = map(control.Time, 0, 5, 0.005, 0.01);
        thunder_params.particleLifeSpan = map(control.Time, 0, 5, 1.0, 0.6);
        thunder_params.flowTimeFreq = map(control.Time, 0, 5, 0.002, 0.005);
    }
    else {
        thunder_params.flowSpd = map(control.Time, 5, 10, 0.01, 0.03);
        thunder_params.particleLifeSpan = map(control.Time, 5, 10, 0.6, 0.3);
        thunder_params.flowTimeFreq = map(control.Time, 5, 10, 0.005, 0.01);
    }

    // Space
    if (control.Space <= 5) {
        thunder_params.anglePossibility = map(control.Space, 0, 5, 0.01, 0.05);
        thunder_params.BranchAngleRange = map(control.Space, 0, 5, 60, 80);
        thunder_params.AngleRange = map(control.Space, 0, 5, 20, 35);
    }
    else {
        thunder_params.anglePossibility = map(control.Space, 5, 10, 0.05, 0.2);
        thunder_params.BranchAngleRange = map(control.Space, 0, 5, 60, 120);
        thunder_params.AngleRange = map(control.Space, 5, 10, 35, 55);
    }

    // flow
    if (control.Flow <= 5) {
        thunder_params.flowPosFreq = map(control.Flow, 0, 5, 0.01, 0.06);
    }
    else {
        thunder_params.flowPosFreq = map(control.Flow, 5, 10, 0.06, 0.2);
    }
}
// ======================== FIRE ==========================
function fire_interaction_controller() {
    if (control.Weight < 5) {
        fire_params.opacityAdj = map(control.Weight, 0, 5, 0.5, 0);
    }
    else {
        fire_params.opacityAdj = 0;
    }

    // time 
    if (control.Time < 5) {
        fire_params.moveupSpd = map(control.Time, 0, 5, 0.7, 1.2);
        fire_params.lifeSpan = 1;
        fire_params.flowForceX = 15;
    }
    else {
        fire_params.moveupSpd = map(control.Time, 5, 10, 1.2, 3);
        fire_params.lifeSpan = map(control.Time, 5, 10, 1, 0.7);
    }

    // Space
    if (control.Space <= 5) {
        fire_params.distributionFreq = map(control.Space, 0, 5, 0.06, 0.02);
    }
    else {
        fire_params.distributionFreq = map(control.Space, 5, 10, 0.02, 0.01);
    }

    // flow
    if (control.Flow > 8) { // flow value big - not fluent
        fire_params.areaSize = map(control.Flow, 8, 10, 1, 0.6);
    }
    else {
        fire_params.areaSize = 1;
    }
}



// ======================== LAKE ==========================
function lake_interaction_controller() {
    // weight
    if (control.Weight < 5) {
        lake_params.Wamplitude = map(control.Weight, 0, 5, 30, 100);
        lake_params.WposScatter = map(control.Weight, 0, 5, 0.8, 1);
    }
    else {
        lake_params.Wamplitude = map(control.Weight, 5, 10, 100, 300);
        lake_params.WposScatter = map(control.Weight, 5, 10, 1, 3);
    }

    // time 
    if (control.Time <= 5) {
        lake_params.WampFreqSin = map(control.Time, 0, 5, 0.0005, 0.003);
    }
    else {
        lake_params.WampFreqSin = map(control.Time, 0, 5, 0.003, 0.006);
    }

    // Space
    if (lake_update_lineNum) {
        lake_params.LakeNum = map(lake_space_int, 0, 10 / 3, 3, 10);
        lake_set_waves();
        lake_update_lineNum = false;
    }

    // flow
    if (control.Flow <= 5) {
        lake_params.Wvel = map(control.Flow, 0, 5, 0.001, 0.1);
    }
    else {
        lake_params.Wvel = map(control.Flow, 5, 10, 0.1, 2);
    }
}


function lake_update_space_int() {
    let calc_space_int = floor(control.Space / 3);
    lake_space_int_prev = lake_space_int;
    if (calc_space_int != lake_space_int) {
        lake_space_int = calc_space_int;
    }
    if (lake_space_int_prev != lake_space_int) {
        lake_update_lineNum = true;
    }
    else {
        lake_update_lineNum = false;
    }
}


// ======================= HEAVEN =========================
function heaven_interaction_controller() { }


// ======================== WIND ==========================
function wind_interaction_controller() { }

