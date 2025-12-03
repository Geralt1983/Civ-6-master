-- DataExporter.lua v3 - Phase 3: Deep Intel Version (FIXED JSON)
function OnTurnBegin()
    local iPlayer = Game.GetLocalPlayer()
    if not iPlayer or iPlayer == -1 then return end
    
    local pPlayer = Players[iPlayer]
    if not pPlayer then return end
    
    local pPlayerConfig = PlayerConfigurations[iPlayer]
    if not pPlayerConfig then return end

    -- GAME SPEED
    local gameSpeed = "GAMESPEED_STANDARD"
    pcall(function()
        local speedTypeId = GameConfiguration.GetGameSpeedType()
        if speedTypeId and GameInfo.GameSpeeds[speedTypeId] then
            gameSpeed = GameInfo.GameSpeeds[speedTypeId].GameSpeedType or "GAMESPEED_STANDARD"
        end
    end)
    
    -- ERA
    local eraName = "Ancient Era"
    pcall(function()
        local eraIndex = pPlayer:GetEra()
        if eraIndex and GameInfo.Eras[eraIndex] then
            eraName = GameInfo.Eras[eraIndex].Name or "Ancient Era"
        end
    end)

    -- YIELDS
    local science = 0
    local culture = 0
    local gold = 0
    local faith = 0
    
    pcall(function()
        local pTechs = pPlayer:GetTechs()
        if pTechs then science = math.floor(pTechs:GetScienceYield()) end
    end)
    
    pcall(function()
        local pCulture = pPlayer:GetCulture()
        if pCulture then culture = math.floor(pCulture:GetCultureYield()) end
    end)
    
    pcall(function()
        local pTreasury = pPlayer:GetTreasury()
        if pTreasury then gold = math.floor(pTreasury:GetGoldBalance()) end
    end)
    
    pcall(function()
        local pReligion = pPlayer:GetReligion()
        if pReligion then faith = math.floor(pReligion:GetFaithYield()) end
    end)

    -- CITY YIELDS AND PRODUCTION DATA
    local totalProd = 0
    local totalFood = 0
    local citiesData = {}
    
    pcall(function()
        local cities = pPlayer:GetCities()
        if cities then
            for i, pCity in cities:Members() do
                if pCity then
                    totalFood = totalFood + pCity:GetYield(0)
                    totalProd = totalProd + pCity:GetYield(1)
                    
                    local currentProduction = "Nothing"
                    pcall(function()
                        local buildQueue = pCity:GetBuildQueue()
                        if buildQueue then
                            local hash = buildQueue:GetCurrentProductionTypeHash()
                            if hash and hash ~= 0 then
                                local info = GameInfo.Units[hash] or GameInfo.Buildings[hash] or GameInfo.Districts[hash] or GameInfo.Projects[hash]
                                if info then currentProduction = info.Name end
                            end
                        end
                    end)
                    
                    local safeName = tostring(pCity:GetName() or "City"):gsub('"', ""):gsub('\\', "")
                    local safeProd = tostring(currentProduction):gsub('"', ""):gsub('\\', "")
                    table.insert(citiesData, {
                        name = safeName,
                        pop = pCity:GetPopulation(),
                        producing = safeProd
                    })
                end
            end
        end
    end)

    -- ARMY COMPOSITION
    local unitSummary = {}
    pcall(function()
        local units = pPlayer:GetUnits()
        if units then
            for i, unit in units:Members() do
                if unit then
                    local unitType = unit:GetUnitType()
                    local unitInfo = GameInfo.Units[unitType]
                    if unitInfo then
                        local name = unitInfo.Name
                        unitSummary[name] = (unitSummary[name] or 0) + 1
                    end
                end
            end
        end
    end)

    -- RESEARCH
    local techName = "None"
    local techProgress = 0
    local techTurns = 0
    
    pcall(function()
        local pTechs = pPlayer:GetTechs()
        if not pTechs then return end
        
        local currentTechID = pTechs:GetResearchingTech()
        if currentTechID and currentTechID ~= -1 then
            local techInfo = GameInfo.Technologies[currentTechID]
            if techInfo and techInfo.Name then
                techName = techInfo.Name
                local cost = pTechs:GetResearchCost(currentTechID)
                local current = pTechs:GetResearchProgress(currentTechID)
                if cost and cost > 0 then 
                    techProgress = math.floor((current / cost) * 100)
                end
                if science and science > 0 then 
                    techTurns = math.ceil((cost - current) / science) 
                end
            end
        end
    end)

    -- CIVIC
    local civicName = "None"
    local civicProgress = 0
    local civicTurns = 0

    pcall(function()
        local pCulture = pPlayer:GetCulture()
        if not pCulture then return end
        
        local currentCivicID = pCulture:GetProgressingCivic()
        if currentCivicID and currentCivicID ~= -1 then
            local civicInfo = GameInfo.Civics[currentCivicID]
            if civicInfo and civicInfo.Name then
                civicName = civicInfo.Name
                local cost = pCulture:GetCultureCost(currentCivicID)
                local current = pCulture:GetCulturalProgress(currentCivicID)
                if cost and cost > 0 then 
                    civicProgress = math.floor((current / cost) * 100) 
                end
                if culture and culture > 0 then 
                    civicTurns = math.ceil((cost - current) / culture) 
                end
            end
        end
    end)

    -- LEADER
    local leaderName = "Unknown"
    pcall(function()
        if pPlayerConfig:GetLeaderName() then
            leaderName = pPlayerConfig:GetLeaderName()
        end
    end)

    -- BUILD PROPER JSON (double quotes for eval())
    local json = 'CIV_DATA_DUMP::{"gameSpeed":"' .. tostring(gameSpeed) .. '"'
    json = json .. ',"turn":' .. tostring(Game.GetCurrentGameTurn())
    json = json .. ',"era":"' .. tostring(eraName) .. '"'
    json = json .. ',"leader":"' .. tostring(leaderName) .. '"'
    json = json .. ',"yields":{'
        json = json .. '"science":' .. tostring(science)
        json = json .. ',"culture":' .. tostring(culture)
        json = json .. ',"faith":' .. tostring(faith)
        json = json .. ',"gold":' .. tostring(gold)
        json = json .. ',"production":' .. tostring(totalProd)
        json = json .. ',"food":' .. tostring(totalFood)
    json = json .. '}'
    
    -- Serialize Cities Array
    json = json .. ',"cities":['
    for i, c in ipairs(citiesData) do
        json = json .. '{"name":"' .. c.name .. '","pop":' .. c.pop .. ',"producing":"' .. c.producing .. '"}'
        if i < #citiesData then json = json .. ',' end
    end
    json = json .. ']'
    
    -- Serialize Army Object
    json = json .. ',"army":{'
    local isFirst = true
    for k, v in pairs(unitSummary) do
        if not isFirst then json = json .. ',' end
        local safeKey = tostring(k):gsub('"', ""):gsub('\\', "")
        json = json .. '"' .. safeKey .. '":' .. v
        isFirst = false
    end
    json = json .. '}'
    
    json = json .. ',"currentResearch":{'
        json = json .. '"name":"' .. tostring(techName) .. '"'
        json = json .. ',"progress":' .. tostring(techProgress)
        json = json .. ',"turnsLeft":' .. tostring(techTurns)
    json = json .. '}'
    json = json .. ',"currentCivic":{'
        json = json .. '"name":"' .. tostring(civicName) .. '"'
        json = json .. ',"progress":' .. tostring(civicProgress)
        json = json .. ',"turnsLeft":' .. tostring(civicTurns)
    json = json .. '}'
    json = json .. '}'

    print(json)
end

if Events and Events.TurnBegin then
    Events.TurnBegin.Add(OnTurnBegin)
end
